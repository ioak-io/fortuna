from __future__ import annotations

import itertools
import json
from typing import Any, Dict, List

from package_unit.utils.http import post_json
from package_unit.services.chunk_service import ChunkService
from package_unit.utils.schema import make_schema
from package_unit.utils.sql import load_sql
from package_unit.services.llm_service import LlmService
import logging
import requests

WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php"
HEADERS = {
    "User-Agent": "MyApp/1.0 (https://example.com/; contact@example.com)"
}


class ImagePipeline:
    def __init__(self, db: Any) -> None:
        self.db = db
        
    def run(self, schema: str, team_id: str, unit_id: int, chunk_interval: int = 5) -> None:
        """
        Image pipeline:
        1. Collect and deduplicate keywords across chunks.
        2. Ask LLM to propose placements based on summaries + keywords,
        targeting ~1 image per `chunk_interval` chunks on average.
        3. Insert image placeholder blocks.
        4. Enrich placeholders with actual image metadata.
        """
        logging.info("image_pipeline_start", extra={"team_id": team_id, "unit_id": unit_id})

        # 1. Collect keywords + summaries
        select_sql = f"""
            SELECT sg.chunk_id, sg.image_keywords, c.summary, sg.content
            FROM {schema}.studyguide sg
            JOIN {schema}.chunk c ON sg.chunk_id = c.id
            WHERE sg.team_id = $1 AND sg.unit_id = $2
            ORDER BY sg.chunk_id
        """
        res = self.db.query(select_sql, [team_id, unit_id])
        rows = res.rows if getattr(res, "rows", None) is not None else res
        if not rows:
            return

        # Deduplicate keywords globally
        unique_keywords = set()
        prepared = []
        for row in rows:
            keywords = row.get("image_keywords") or []
            keywords = [kw.strip().lower() for kw in keywords]
            keywords = [kw for kw in keywords if kw and kw not in unique_keywords]
            if not keywords:
                continue
            unique_keywords.update(keywords)
            prepared.append({
                "chunk_id": row["chunk_id"],
                "summary": row.get("summary"),
                "keywords": keywords,
            })

        if not prepared:
            return
        
        # Remove existing image blocks before reinserting
        cleanup_sql = f"""
            UPDATE {schema}.studyguide
            SET content = (
                SELECT jsonb_agg(block)
                FROM jsonb_array_elements(content::jsonb) block
                WHERE NOT (block->>'type' = 'image')
            )
            WHERE team_id = $1 AND unit_id = $2
        """
        self.db.query(cleanup_sql, [team_id, unit_id])
        
        target_images = max(1, round(len(rows) / chunk_interval))

        # 2. Ask LLM for placement decisions
        # Define prompt template with placeholders
        system_prompt = (
            "You are an assistant that decides where to place images in a study guide. "
            "You will be given a sequence of chunks (with chunk_id, summary, and candidate image keywords). "
            "Rules:\n"
            "- There are {{total_chunks}} chunks. You MUST return exactly {{target_images}} image placements.\n"
            "- Do not place more than 1 image in the same chunk.\n"
            "- Ensure that important keywords are represented at least once.\n"
            "- You may shift keywords to a nearby chunk if placement makes more sense.\n"
            "- Do not overload: spread images evenly and keep spacing natural.\n"
            "Output strictly valid JSON: an array of objects, each with:\n"
            "{ \"chunk_id\": int, \"keywords\": [..], \"provider\": \"wikimedia|smithsonian|nasa|internet-archive\" }"
        )

        # Replace placeholders
        system_prompt = (
            system_prompt
            .replace("{{total_chunks}}", str(len(rows)))
            .replace("{{target_images}}", str(target_images))
        )

        # User prompt
        user_prompt = (
            f"Total chunks = {len(rows)}. "
            f"You must select exactly {target_images} placements.\n\n"
            "Here are the candidates:\n"
            + json.dumps(prepared, indent=2)
        )
        
        llm = LlmService()
        raw_output = llm.complete(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ]
        )

        try:
            decisions = json.loads(raw_output)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON from LLM: {e}\n\n{raw_output}")
        
        # 3. Insert placeholders into studyguide
        for d in decisions:
            cid = d.get("chunk_id")
            keywords = d.get("keywords") or []
            provider = d.get("provider") or "wikimedia"
            if not cid or not keywords:
                continue

            update_sql = f"""
                UPDATE {schema}.studyguide
                SET content = (
                    content::jsonb || jsonb_build_array(
                        jsonb_build_object(
                            'type','image',
                            'keywords',$3::jsonb,
                            'sourceHint',$4::text
                        )
                    )
                )
                WHERE team_id = $1::uuid AND unit_id = $2::int AND chunk_id = $5::int
            """
            self.db.query(update_sql, [team_id, unit_id, json.dumps(keywords), provider, cid])
        
        res = self.db.query(select_sql, [team_id, unit_id])
        rows = res.rows if getattr(res, "rows", None) is not None else res

        # 4. Enrich placeholders
        for row in rows:
            cid = row["chunk_id"]
            blocks = row["content"]
            if isinstance(blocks, str):
                try:
                    blocks = json.loads(blocks)
                except Exception:
                    logging.warning("invalid_blocks_json", extra={"chunk_id": cid})
                    continue

            enriched_blocks = self.enrich_blocks_with_images(blocks)
            update_sql = f"""
                UPDATE {schema}.studyguide
                SET content = $3
                WHERE team_id = $1 AND unit_id = $2 AND chunk_id = $4
            """
            self.db.query(update_sql, [team_id, unit_id, json.dumps(enriched_blocks), cid])

        logging.info("image_pipeline_complete", extra={"team_id": team_id, "unit_id": unit_id})

    def search_smithsonian(self, query, limit=20):
        logging.info("search_smithsonian")
        url = "https://api.si.edu/openaccess/api/v1.0/search"
        params = {
            "api_key": "UCHIuvIBgEjsxWGgcgzz9nhU0rNsVjMgmpEX0KXA",  # required
            "q": query,
            "rows": limit,
        }

        resp = requests.get(url, params=params, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        # Keep only rows with media
        rows = []
        for row in data.get("response", {}).get("rows", []):
            desc = row.get("content", {}).get("descriptiveNonRepeating", {})
            if "online_media" in desc and desc["online_media"].get("media"):
                rows.append(row)

        return {"status": resp.status_code, "response": {"rows": rows}}

    def search_nasa(self, query, limit=10):
        logging.info("search_nasa")
        url = "https://images-api.nasa.gov/search"
        params = {
            "q": query,
            "media_type": "image",
            "page_size": limit
        }
        resp = requests.get(url, params=params, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        return resp.json()

    def search_internet_archive(self, query, limit=10):
        logging.info("search_internet_archive")
        url = "https://archive.org/advancedsearch.php"
        params = {
            "q": query,
            "fl[]": ["identifier", "title", "mediatype", "format"],
            "rows": limit,
            "output": "json"
        }
        resp = requests.get(url, params=params, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        return resp.json()

    WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php"
    HEADERS = {
        "User-Agent": "MyApp/1.0 (https://example.com/; contact@example.com)"
    }

    def search_wikimedia(self, query, limit=20):
        logging.info("search_wikimedia")
        params = {
            "action": "query",
            "format": "json",
            "prop": "imageinfo",
            "iiprop": "url|mime|extmetadata",
            "generator": "search",
            "gsrsearch": query,
            "gsrlimit": limit,
            "gsrnamespace": 6,  # File namespace only (images)
            "origin": "*",
        }
        resp = requests.get(WIKIMEDIA_API, params=params,
                            headers=HEADERS, timeout=10)
        resp.raise_for_status()
        return resp.json()

    def extract_smithsonian_images(self, data, keywords, max_results=3):
        rows = data.get("response", {}).get("rows", [])
        candidates = []

        for row in rows:
            desc = row.get("content", {}).get("descriptiveNonRepeating", {})
            media_list = desc.get("online_media", {}).get("media", [])
            title = desc.get("title", {}).get("content", row.get("title", ""))

            for media in media_list:
                url = media.get("content") or media.get("thumbnail")
                if not url:
                    continue

                candidates.append({
                    "src": url,
                    "title": title,
                    "license": desc.get("metadata_usage", {}).get("access", ""),
                    "attribution": row.get("content", {}).get("freetext", {})
                    .get("name", [{}])[0]
                    .get("content", ""),
                    "sourceUrl": desc.get("record_link", ""),
                    "keywords": keywords,
                })

        return candidates[:max_results]

    def extract_nasa_images(self, data, keywords, max_results=3):
        items = data.get("collection", {}).get("items", [])
        results = []
        for item in items:
            links = item.get("links", [])
            if not links:
                continue
            href = links[0].get("href")
            meta = item.get("data", [{}])[0]
            results.append({
                "src": href,
                "title": meta.get("title"),
                "license": "Public Domain (NASA)",
                "attribution": meta.get("center", ""),
                "sourceUrl": f"https://images.nasa.gov/details-{meta.get('nasa_id')}",
                "keywords": keywords,
            })
        return results[:max_results]

    def extract_internet_archive_images(self, data, keywords, max_results=3):
        docs = data.get("response", {}).get("docs", [])
        results = []
        for doc in docs:
            if doc.get("mediatype") != "image":
                continue
            identifier = doc.get("identifier")
            if not identifier:
                continue
            results.append({
                "src": f"https://archive.org/download/{identifier}/{identifier}.jpg",
                "title": doc.get("title"),
                "license": "Varies (check source)",
                "attribution": "",
                "sourceUrl": f"https://archive.org/details/{identifier}",
                "keywords": keywords,
            })
        return results[:max_results]

    def extract_wikimedia_images(self, data, keywords, max_results=3):
        pages = data.get("query", {}).get("pages", {})
        allowed_ext = (".png", ".jpg", ".jpeg", ".svg")

        candidates = []
        for page in pages.values():
            if "imageinfo" in page:
                info = page["imageinfo"][0]
                mime = info.get("mime", "")
                url = info.get("url", "")

                # Only allow valid images
                if not mime.startswith("image/"):
                    continue
                if not url.lower().endswith(allowed_ext):
                    continue

                title = page.get("title", "")
                candidates.append({
                    "src": url,
                    "license": info.get("extmetadata", {}).get("LicenseShortName", {}).get("value", ""),
                    "attribution": info.get("extmetadata", {}).get("Artist", {}).get("value", ""),
                    "sourceUrl": "https://commons.wikimedia.org/wiki/" + title,
                    "title": title.lower(),
                    "keywords": keywords,
                })

        # Sort: prefer diagrams/graphs/structures/cycles
        candidates.sort(
            key=lambda c: any(w in c["title"] for w in [
                              "diagram", "graph", "cycle", "structure"]),
            reverse=True
        )

        return candidates[:max_results]

    def find_wikimedia_image(self, keywords_list, used_images: set[str], max_alternatives=3):
        search_strategies = []

        # 1. Strict AND (all keywords together)
        search_strategies.append((" ".join(keywords_list), keywords_list))

        # 2. Subsets (triplets then pairs)
        if len(keywords_list) > 2:
            for r in range(len(keywords_list) - 1, 1, -1):
                for combo in itertools.combinations(keywords_list, r):
                    search_strategies.append((" ".join(combo), list(combo)))

        # 3. Individual keywords
        for kw in keywords_list:
            search_strategies.append((kw, [kw]))

        # 4. OR query fallback
        search_strategies.append((" OR ".join(keywords_list), keywords_list))

        for query, used_keywords in search_strategies:
            try:
                data = self.search_wikimedia(query)
                candidates = self.extract_wikimedia_images(
                    data, used_keywords, max_results=max_alternatives+1)

                # Filter out previously used images
                candidates = [
                    c for c in candidates if c["src"] not in used_images]

                if candidates:
                    best = candidates[0]
                    alternatives = candidates[1:max_alternatives]
                    # mark them as used
                    used_images.update([best["src"]] + [a["src"]
                                       for a in alternatives])
                    return {
                        "best": best,
                        "alternatives": alternatives,
                        "queryUsed": query
                    }
            except Exception:
                continue

        # Nothing found
        return {
            "best": {
                "type": "image",
                "src": None,
                "license": "",
                "attribution": "",
                "sourceUrl": "",
                "keywords": keywords_list,
                "error": f"No suitable Wikimedia image found for {keywords_list}",
            },
            "alternatives": [],
            "queryUsed": None
        }

    def enrich_blocks_with_images(self, blocks, used_images: set[str] | None = None, max_alternatives=3):
        if used_images is None:
            used_images = set()

        enriched = []
        for block in blocks:
            if block.get("type") == "image":
                keywords = block.get("keywords", [])
                source_hint = (block.get("sourceHint") or "").lower()

                result = None
                if source_hint == "smithsonian":
                    data = self.search_smithsonian(" ".join(keywords))
                    candidates = self.extract_smithsonian_images(
                        data, keywords, max_results=max_alternatives+1)

                    if candidates:
                        result = {
                            "best": candidates[0], "alternatives": candidates[1:max_alternatives], "queryUsed": "smithsonian"}
                elif source_hint == "nasa":
                    data = self.search_nasa(" ".join(keywords))
                    candidates = self.extract_nasa_images(
                        data, keywords, max_results=max_alternatives+1)
                    if candidates:
                        result = {
                            "best": candidates[0], "alternatives": candidates[1:max_alternatives], "queryUsed": "nasa"}
                elif source_hint == "internet-archive":
                    data = self.search_internet_archive(" ".join(keywords))
                    candidates = self.extract_internet_archive_images(
                        data, keywords, max_results=max_alternatives+1)
                    if candidates:
                        result = {
                            "best": candidates[0], "alternatives": candidates[1:max_alternatives], "queryUsed": "internet-archive"}

                # If no result OR no sourceHint, fallback to Wikimedia
                if not result:
                    result = self.find_wikimedia_image(
                        keywords, used_images, max_alternatives=max_alternatives)

                enriched.append({
                    "type": "image",
                    "keywords": keywords,
                    "sourceHint": source_hint or "wikimedia",
                    "best": result["best"],
                    "alternatives": result["alternatives"],
                    "queryUsed": result["queryUsed"],
                })
            else:
                enriched.append(block)
        return enriched
