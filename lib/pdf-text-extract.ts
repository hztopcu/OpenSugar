/**
 * Extract raw text from a PDF using pdfjs-dist legacy Node.js build.
 * File is read as ArrayBuffer then Uint8Array. Safe for Vercel/serverless (no DOMMatrix dependency).
 */

/** Minimal DOMMatrix polyfill for Node.js (pdfjs-dist legacy build expects it). */
function ensureNodePolyfills(): void {
  if (typeof globalThis.DOMMatrix === "undefined") {
    globalThis.DOMMatrix = class DOMMatrix {
      a = 1;
      b = 0;
      c = 0;
      d = 1;
      e = 0;
      f = 0;
      constructor(init?: number[] | string) {
        if (Array.isArray(init) && init.length >= 6) {
          this.a = init[0];
          this.b = init[1];
          this.c = init[2];
          this.d = init[3];
          this.e = init[4];
          this.f = init[5];
        }
      }
    } as unknown as typeof globalThis.DOMMatrix;
  }
}

/**
 * Normalize input to Uint8Array for pdfjs. Handles ArrayBuffer and Node Buffer (serverless).
 */
function toUint8Array(data: ArrayBuffer | Buffer): Uint8Array {
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  if (typeof Buffer !== "undefined" && data instanceof Buffer) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }
  return new Uint8Array(data as unknown as ArrayBuffer);
}

export async function extractTextFromPdfBuffer(arrayBuffer: ArrayBuffer | Buffer): Promise<string> {
  ensureNodePolyfills();

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (pdfjs.GlobalWorkerOptions && typeof pdfjs.GlobalWorkerOptions.workerSrc !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = "";
  }

  const uint8 = toUint8Array(arrayBuffer);
  const loadingTask = pdfjs.getDocument({
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
