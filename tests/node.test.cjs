const { test } = require("node:test");
const assert = require("node:assert/strict");
const { NanoBanana } = require("../dist/nodes/NanoBanana/NanoBanana.node.js");
const { taskResult } = require("../dist/nodes/NanoBanana/helpers.js");
const {
  AceDataNanoBananaApi,
} = require("../dist/credentials/AceDataNanoBananaApi.credentials.js");
function context(
  parameters,
  responses,
  { count = 1, continueOnFail = false } = {},
) {
  const calls = [];
  let next = 0;
  return {
    calls,
    getInputData: () => Array.from({ length: count }, () => ({ json: {} })),
    getNode: () => ({
      name: "Test NanoBanana",
      type: "@acedatacloud/n8n-nodes-nano-banana.nanoBanana",
      typeVersion: 1,
      position: [0, 0],
      parameters: {},
    }),
    getNodeParameter: (name, index, fallback) => {
      const p = Array.isArray(parameters) ? parameters[index] : parameters;
      return name in p ? p[name] : fallback;
    },
    continueOnFail: () => continueOnFail,
    helpers: {
      httpRequestWithAuthentication: async (credential, request) => {
        calls.push({ credential, ...request });
        const response = responses[next++];
        if (response instanceof Error) throw response;
        return response;
      },
      returnJsonArray: (data) => data.map((json) => ({ json })),
      constructExecutionMetaData: (data, meta) =>
        data.map((item) => ({ ...item, pairedItem: meta.itemData })),
    },
  };
}

const node = new NanoBanana();
const create = {
  resource: "image",
  operation: "generate",
  prompt: "A clean product photo of a white ceramic mug on a blue tabletop",
  model: "nano-banana",
  count: 1,
  aspectRatio: "1:1",
  resolution: "1K",
  simplify: true,
};

test("generation submits once asynchronously, keeps model selection and input pairing", async () => {
  const ctx = context(create, [{ task_id: "new-task", trace_id: "trace" }]);
  const [items] = await node.execute.call(ctx);
  assert.equal(ctx.calls.length, 1);
  assert.equal(
    ctx.calls[0].url,
    "https://api.acedata.cloud/nano-banana/images",
  );
  assert.equal(ctx.calls[0].credential, "aceDataNanoBananaApi");
  assert.equal(ctx.calls[0].body.async, true);
  assert.equal(
    ctx.calls[0].body.model ?? ctx.calls[0].headers.model,
    create.model,
  );
  assert.deepEqual(items[0].json, {
    taskId: "new-task",
    status: "submitted",
    finished: false,
    successful: null,
    traceId: "trace",
  });
  assert.deepEqual(items[0].pairedItem, { item: 0 });
});
test("credential is masked and tested with a query-only empty batch", () => {
  const c = new AceDataNanoBananaApi();
  assert.equal(c.properties[0].typeOptions.password, true);
  assert.match(c.authenticate.properties.headers.Authorization, /Bearer/);
  assert.equal(c.test.request.url, "/nano-banana/tasks");
  assert.deepEqual(c.test.request.body, { action: "retrieve_batch", ids: [] });
});

test("task states distinguish acknowledgment, processing, success and failure", () => {
  assert.equal(taskResult({ id: "a", success: true }).finished, false);
  assert.equal(taskResult({ id: "a", response: { data: [] } }).finished, false);
  assert.equal(
    taskResult({
      id: "a",
      finished_at: 1,
      response: { data: [{ url: "https://example.com/a.png" }] },
    }).status,
    "succeeded",
  );
  assert.equal(
    taskResult({
      id: "a",
      state: "succeeded",
      response: { success: false, error: { code: "rejected" } },
    }).status,
    "failed",
  );
  const voice = taskResult({
    id: "a",
    finished_at: 1,
    response: {
      audio_url: "https://example.com/a.mp3",
      cost: { amount: 1, currency: "credit" },
    },
  });
  assert.equal(voice.status, "succeeded");
  assert.equal(voice.data.audio_url, "https://example.com/a.mp3");
  assert.equal(voice.cost.amount, 1);
});
test("query emits failed task data instead of treating it as a successful generation", async () => {
  const ctx = context(
    { resource: "task", operation: "get", taskId: "a", simplify: true },
    [{ id: "a", error: { code: "content_moderation", message: "Rejected" } }],
  );
  const [items] = await node.execute.call(ctx);
  assert.equal(items[0].json.successful, false);
  assert.equal(items[0].json.error.code, "content_moderation");
});
test("batch query emits separate items and preserves item links", async () => {
  const ctx = context(
    { resource: "task", operation: "getMany", taskIds: "a, b", simplify: true },
    [
      {
        items: [
          { id: "a" },
          { id: "b", response: { success: true, data: [] } },
        ],
      },
    ],
  );
  const [items] = await node.execute.call(ctx);
  assert.deepEqual(ctx.calls[0].body, {
    action: "retrieve_batch",
    ids: ["a", "b"],
  });
  assert.equal(items.length, 2);
  assert.deepEqual(items[1].pairedItem, { item: 0 });
});
test("empty or excessive batch IDs and missing tasks fail clearly", async () => {
  for (const taskIds of ["", Array(51).fill("id").join(",")]) {
    const ctx = context(
      { resource: "task", operation: "getMany", taskIds },
      [],
    );
    await assert.rejects(node.execute.call(ctx));
    assert.equal(ctx.calls.length, 0);
  }
  await assert.rejects(
    node.execute.call(
      context({ resource: "task", operation: "get", taskId: "missing" }, [{}]),
    ),
    /not found/i,
  );
});
test("continue-on-fail preserves later inputs without retrying paid requests", async () => {
  const ctx = context(
    [create, create],
    [new Error("429 rate limit"), { task_id: "second" }],
    { count: 2, continueOnFail: true },
  );
  const [items] = await node.execute.call(ctx);
  assert.equal(ctx.calls.length, 2);
  assert.match(items[0].json.error, /429/);
  assert.equal(items[1].json.taskId, "second");
  assert.deepEqual(items[1].pairedItem, { item: 1 });
});
test("malformed acknowledgments and API errors fail", async () => {
  await assert.rejects(
    node.execute.call(context(create, [{ success: true }])),
    /task ID/i,
  );
  await assert.rejects(
    node.execute.call(
      context(create, [
        { success: false, error: { message: "Invalid request" } },
      ]),
    ),
    /Invalid request/i,
  );
});
test("raw task output remains unchanged", async () => {
  const raw = {
    id: "a",
    finished_at: 1,
    response: { success: true, data: [] },
    request: { prompt: "original" },
  };
  const [items] = await node.execute.call(
    context(
      { resource: "task", operation: "get", taskId: "a", simplify: false },
      [raw],
    ),
  );
  assert.deepEqual(items[0].json, raw);
});
test("the bounded polling workflow cannot submit Create again", () => {
  const w = require("../examples/generate-and-wait.json");
  const queue = ["Get Task"];
  const seen = new Set();
  while (queue.length) {
    const name = queue.shift();
    if (seen.has(name)) continue;
    seen.add(name);
    for (const branch of w.connections[name]?.main ?? [])
      for (const edge of branch) queue.push(edge.node);
  }
  assert.equal(seen.has("Create"), false);
  assert.equal(seen.has("Stop Waiting"), true);
  assert.equal(seen.has("Generation Failed"), true);
  assert.equal(w.nodes.find((n) => n.name === "Create").retryOnFail, false);
  assert.equal(JSON.stringify(w).includes("apiToken"), false);
});

test("image editing validates references and sends their full URLs", async () => {
  const ctx = context(
    {
      ...create,
      operation: "edit",
      imageUrls: "https://example.com/a.png\nhttps://example.com/b.png",
    },
    [{ task_id: "edit" }],
  );
  await node.execute.call(ctx);
  assert.equal(ctx.calls[0].body.action, "edit");
  assert.deepEqual(ctx.calls[0].body.image_urls, [
    "https://example.com/a.png",
    "https://example.com/b.png",
  ]);
});
test("unsupported lite resolution fails before any paid request", async () => {
  const ctx = context(
    { ...create, model: "nano-banana-2-lite", resolution: "4K" },
    [],
  );
  await assert.rejects(node.execute.call(ctx), /only 1K/);
  assert.equal(ctx.calls.length, 0);
});
test("image count is bounded and references are required for edit", async () => {
  for (const invalid of [
    { count: 5 },
    { count: 1.5 },
    { operation: "edit", imageUrls: "" },
  ]) {
    const ctx = context({ ...create, ...invalid }, []);
    await assert.rejects(node.execute.call(ctx));
    assert.equal(ctx.calls.length, 0);
  }
});
