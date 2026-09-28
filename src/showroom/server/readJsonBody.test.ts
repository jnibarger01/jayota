import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ApiError } from "../api/errors.ts";
import { errorResponse } from "./apiResponse.ts";
import { DEFAULT_MAX_JSON_BODY_BYTES, readJsonBody } from "./readJsonBody.ts";

function streamOf(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let pulled = 0;
  return new ReadableStream({
    pull(controller) {
      if (pulled < chunks.length) controller.enqueue(encoder.encode(chunks[pulled++]));
      else controller.close();
    },
  });
}

function post(body: BodyInit, headers: Record<string, string> = {}): Request {
  return new Request("http://local/api/v1/configurations", {
    method: "POST",
    body,
    headers,
    // @ts-expect-error -- Node's undici requires duplex for streamed request bodies.
    duplex: "half",
  });
}

async function rejectsWith(promise: Promise<unknown>, status: number, code: string) {
  await assert.rejects(promise, (err: unknown) => {
    assert.ok(err instanceof ApiError);
    assert.equal(err.status, status);
    assert.equal(err.code, code);
    return true;
  });
}

describe("readJsonBody", () => {
  it("parses a body under the limit", async () => {
    assert.deepEqual(await readJsonBody(post(JSON.stringify({ a: 1 })), { maxBytes: 100 }), { a: 1 });
  });

  it("defaults to 64 KiB", () => {
    assert.equal(DEFAULT_MAX_JSON_BODY_BYTES, 65536);
  });

  it("rejects an oversized declared Content-Length before reading", async () => {
    let pulled = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        controller.enqueue(new TextEncoder().encode("x"));
      },
    });
    await rejectsWith(readJsonBody(post(body, { "content-length": "1000" }), { maxBytes: 100 }), 413, "payload_too_large");
    assert.ok(pulled <= 1, "body should not be consumed");
  });

  it("stops streaming once an undeclared body passes the limit", async () => {
    let pulled = 0;
    const endless = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        controller.enqueue(new TextEncoder().encode("a".repeat(40)));
      },
    });
    await rejectsWith(readJsonBody(post(endless), { maxBytes: 100 }), 413, "payload_too_large");
    assert.ok(pulled < 10, `read ${pulled} chunks; should stop right after the limit`);
  });

  it("does not trust an understated Content-Length", async () => {
    const req = post(streamOf(['{"a":"', "b".repeat(200), '"}']), { "content-length": "10" });
    await rejectsWith(readJsonBody(req, { maxBytes: 100 }), 413, "payload_too_large");
  });

  it("maps invalid JSON to invalid_body", async () => {
    await rejectsWith(readJsonBody(post("{not json"), { maxBytes: 100 }), 422, "invalid_body");
  });

  it("maps an empty body to invalid_body", async () => {
    await rejectsWith(readJsonBody(post(""), { maxBytes: 100 }), 422, "invalid_body");
  });

  it("renders 413 through the standard error envelope with security headers", async () => {
    const err = await readJsonBody(post("x".repeat(200)), { maxBytes: 100 }).catch((e) => e);
    const res = errorResponse(err);
    assert.equal(res.status, 413);
    assert.deepEqual((await res.json()).error.code, "payload_too_large");
    assert.ok(res.headers.get("content-security-policy"));
  });
});
