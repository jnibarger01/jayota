import { invalidBody, payloadTooLarge } from "../api/errors.ts";

/** Default cap for configuration write bodies. Real payloads are a few KiB. */
export const DEFAULT_MAX_JSON_BODY_BYTES = 64 * 1024;

function configuredMaxBytes(): number {
  const raw = typeof process !== "undefined" ? process.env?.SHOWROOM_MAX_JSON_BODY_BYTES : undefined;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_JSON_BODY_BYTES;
}

/**
 * Reads and parses a JSON request body without buffering more than `maxBytes`.
 * Rejects early on a declared `Content-Length` over the limit, and stops streaming as soon as the
 * running total passes it (covers chunked or understated bodies). Over the limit -> 413
 * `payload_too_large`; unparseable JSON -> the existing `invalid_body` error.
 */
export async function readJsonBody(
  request: Request,
  options: { maxBytes?: number } = {},
): Promise<unknown> {
  const maxBytes = options.maxBytes ?? configuredMaxBytes();
  const tooLarge = () => payloadTooLarge(`Request body exceeds ${maxBytes} bytes.`);

  const declared = request.headers.get("content-length");
  if (declared !== null && Number(declared) > maxBytes) throw tooLarge();

  let text = "";
  if (request.body) {
    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => {});
        throw tooLarge();
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  }

  try {
    return JSON.parse(text);
  } catch {
    throw invalidBody("Request body must be valid JSON.");
  }
}
