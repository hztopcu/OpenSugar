/**
 * Extract raw text from a PDF using pdfjs-dist (no pdf-parse).
 * File is read as ArrayBuffer then Uint8Array. For use in Node/Next.js server (e.g. Vercel).
 */

export async function extractTextFromPdfBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  const uint8 = new Uint8Array(arrayBuffer);
  const { getDocument } = await import("pdfjs-dist");
  const loadingTask = getDocument({
    data: uint8,
    useWorkerFetch: false,
    verbosity: 0,
  });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const parts: string[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    parts.push(pageText);
  }
  await pdf.destroy();
  return parts.join("\n");
}
