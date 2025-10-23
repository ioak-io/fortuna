export function chunkText(
  text: string,
  chunkSize = 250,
  overlap = 40
): string[] {
  if (!text || !text.trim()) return [];

  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let currentWords: string[] = [];

  const flush = () => {
    if (currentWords.length) chunks.push(currentWords.join(" ").trim());
  };

  for (const para of paragraphs) {
    for (const word of para.split(/\s+/)) {
      currentWords.push(word);

      if (currentWords.length >= chunkSize) {
        let chunkText = currentWords.join(" ");
        const lastSentenceEnd = Math.max(
          chunkText.lastIndexOf("."),
          chunkText.lastIndexOf("?"),
          chunkText.lastIndexOf("!")
        );

        if (lastSentenceEnd > 0 && lastSentenceEnd > chunkText.length * 0.7) {
          chunkText = chunkText.slice(0, lastSentenceEnd + 1);
        }

        chunks.push(chunkText.trim());
        currentWords = currentWords.slice(Math.max(currentWords.length - overlap, 0));
      }
    }
  }

  flush();
  return chunks;
}
