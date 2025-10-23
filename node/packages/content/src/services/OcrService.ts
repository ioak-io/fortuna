import { OcrResponse } from "../types";

export class OcrService {
  static async extractText(
    fileBuffer: Buffer,
    mimeType?: string,
    authHeaders?: { authorization?: string; "x-tenant"?: string }
  ): Promise<string> {
    const formData = new FormData();

    // Convert Node Buffer → Uint8Array for Blob compatibility
    formData.append("file", new Blob([new Uint8Array(fileBuffer)], { type: mimeType || "application/octet-stream" }), "uploaded_file");

    const headers: Record<string, string> = {
      ...(authHeaders?.authorization ? { authorization: authHeaders.authorization } : {}),
      ...(authHeaders?.["x-tenant"] ? { "x-tenant": authHeaders["x-tenant"] } : {})
    };

    const response = await fetch(`${process.env.API_URL}/ocr/extract`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OCR service failed: ${response.status} ${response.statusText}`);
    }

    const data: OcrResponse = await response.json();
    const filename = Object.keys(data)[0];
    return data[filename] || "";
  }
}
