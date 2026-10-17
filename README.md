![Nano Banana for n8n](https://raw.githubusercontent.com/AceDataCloud/NanoBananaN8N/main/assets/banner.png)

# Nano Banana by Ace Data Cloud — n8n community node

Generate and edit Nano Banana images, control composition and resolution, and track tasks in n8n with AceDataCloud.

[![npm](https://img.shields.io/npm/v/@acedatacloud/n8n-nodes-nano-banana)](https://www.npmjs.com/package/@acedatacloud/n8n-nodes-nano-banana) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Package:** `@acedatacloud/n8n-nodes-nano-banana` · **License:** MIT · **Node:** Nano Banana by Ace Data Cloud

Maintained by **Ace Data Cloud**, connecting to **AceDataCloud's API**. This is not an official package from the model developer. A direct provider subscription does not supply an AceDataCloud API credential.

## What you can build

- Generate product photos and campaign illustrations from spreadsheet briefs.
- Edit backgrounds or combine visual references for social content.
- Pass generated image URLs to publishing and review workflows.

## Installation

In self-hosted n8n, open **Settings → Community nodes → Install**, enter `@acedatacloud/n8n-nodes-nano-banana`, review the package and install. To reproduce this release exactly, use `@acedatacloud/n8n-nodes-nano-banana@0.1.1`.

See [n8n's installation guide](https://docs.n8n.io/integrations/community-nodes/installation-and-management/). n8n Cloud requires verified community nodes. npm publication and verification are separate; check the n8n node panel for current Cloud availability.

## Operations

| Resource | Operation | Result |
| --- | --- | --- |
| Image | Generate | Create 1–4 images from a prompt |
| Image | Edit | Edit or combine supplied image references |
| Task | Get | Retrieve one task's state, result, error and reported cost |
| Task | Get Many | Retrieve up to 50 explicit task IDs as separate n8n items |

## Use the node

Search for **Nano Banana** after installation. Choose **Nano Banana by Ace Data Cloud**; the integration is maintained by Ace Data Cloud, not the model developer. Related search phrases are `nano banana`, `nanobanana`, `nano-banana`. These are discovery hints, not a claim about search rank or official approval.

- **Self-hosted n8n:** follow [the official community-node installation instructions](https://docs.n8n.io/integrations/community-nodes/installation-and-management/gui-installation/) and install `@acedatacloud/n8n-nodes-nano-banana`. After installation, add a Manual Trigger (or use your existing trigger), then use its next **+** to find the node. This is a processing/query node, not a trigger.
- **n8n Cloud:** use [the verified-node picker](https://docs.n8n.io/integrations/community-nodes/installation-and-management/install-verified-community-nodes/) only when this package is officially available there. Do not paste an unverified package name into Cloud or treat npm publication as verification.
- Create **Nano Banana by Ace Data Cloud API** in n8n credentials, then paste your raw application API token into **API Token**. See [Credentials](#credentials) for account registration, General application initialization and optional expiry/access/usage limits.

### Read an existing task first

1. Add this node after a trigger and choose **Resource → Task**, **Operation → Get**. Select the credential for this service.
2. Paste an existing task ID returned by this same service. The **Task ID** field is not a prompt or a video/image URL. Leave creation and n8n retry-on-fail off.
3. Execute that query node once. Continue only when `finished` and `successful` are true; inspect `data` for the final media URL. A pending response or task ID is not the final output. Record 401/403 and check access rather than creating a replacement task.

For new creation, choose **Resource → Image**, **Operation → Generate**, then explicitly select the model and inputs. Check [current pricing](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=nanobananan8n_readme_pricing) and balance before executing once. Keep the returned ID and query it after a timeout; restarting creation can incur another charge. Each incoming item can create a separate task. No model fallback is added by this integration.

The API-key screenshots below are real platform references; this README does not claim that they show an n8n installation or output. Native n8n installation/configuration screenshots must identify the actual package/version and contain no secret. All customer-facing node text and documentation remain English to match [n8n verification requirements](https://docs.n8n.io/connect/create-nodes/build-your-node/reference/verification-guidelines/).

## Credentials

1. Open [Ace Data Cloud → Applications](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=nanobananan8n_readme_api_key). Sign in, or register an account first.
2. Find **General application**. If it has not been created, choose **Initialize General Application**. A general key can use the services available to your account; a dedicated application's key is limited to its service. Check the required service/model access and [current pricing](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=nanobananan8n_readme_pricing).
3. Copy the **API Key** from the application card, or open **Keys / Manage Keys → Create** to create a separate key for this integration. Give it a recognizable name so you can revoke or rotate it independently.
4. When creating a key, review **Expiration Time**, **Set Usage Limitation**, and **Allowed APIs**. Enable only the restrictions you need, allow the operations you will call, then click **Create** and copy the token from the key list. Task lookup does not grant permission to submit a generation. Confirm the application's balance can cover your first request; any trial allowance is whatever your account currently displays.
5. Copy only the token value, without quotation marks, spaces, or `Bearer `. An API Key / API Token field expects this raw value; only a manually configured HTTP `Authorization` header needs the `Bearer ` prefix. A `platform-...` account-management token cannot replace a generation API key.

![Copy an application API key or open Manage Keys](https://raw.githubusercontent.com/AceDataCloud/NanoBananaDify/2522b2f57210597af2db866445319334a1677a23/_assets/tutorial/get-api-key-en.png)

![Create a separately named key with optional restrictions](https://raw.githubusercontent.com/AceDataCloud/NanoBananaDify/2522b2f57210597af2db866445319334a1677a23/_assets/tutorial/create-api-key-en.png)

Save the key in the client's credential store or the environment variable shown below. Never put it in a prompt, shared workflow, screenshot, or Git commit. If authentication fails, check the full copied value, application/service access, expiration, usage limit, and balance before creating another key.

In n8n, open a node and create a **Nano Banana by Ace Data Cloud API** credential. Paste the raw value into **API Token**, save, and select this credential on every node that needs it, including task readers.

The token is masked and stored in n8n's credential store. The node sends Bearer authentication only to `https://api.acedata.cloud`. Its credential test queries an empty task batch and does not generate media. Do not use a platform management token.


## Quick start and examples

Import [Generate and wait](examples/generate-and-wait.json), assign credentials to **Create** and **Get Task**, and edit the generation parameters. One manual execution submits once, then queries every 15 seconds. The loop has a 30-minute deadline and explicit failure handling. A deadline stops waiting; it does not cancel a submitted service task.

Import [AI Agent task tool](examples/ai-agent-task-tool.json) to use the node as a read-only tool. Replace the sample task ID, configure the chat model and select the service credential. The agent queries a task once; it does not create media.

Additional examples are in [examples/](examples/). They contain no credentials and no pinned or fabricated output.

## Example output

Generated through this node with `nano-banana` during live validation:

![Generated example](https://cdn.acedata2.cloud/nanobanana/50dc41c576fc77aa5ecbf81ee0d706a5e491c5cf9b8fb8ff0e19593e3b125732.png)

## Parameters and limits

- Models: Nano Banana, Nano Banana 2 Lite, Nano Banana 2 and Nano Banana Pro, including their exposed `:official` variants.
- Image count: 1–4. Reference images are supplied one per line or as an expression returning an array. HTTP(S) and PNG/JPEG/WebP data URLs are accepted.
- Nano Banana 2 Lite supports only 1K. Other model capabilities are governed by the current API documentation.
- The API can return fewer successful images than requested. Use the final `data` and `cost`, not the requested count, to inspect results.

## Output and task states

With **Simplify** enabled:

- Generation returns `taskId`, `status: "submitted"`, `finished: false`, `successful: null` and `traceId`.
- Task queries return `taskId`, `status` (`processing`, `succeeded` or `failed`), `finished`, `successful`, `data`, `error`, `traceId` and `cost`.
- Final media URLs are inside `data`. Fish TTS responses with a top-level `audio_url` are exposed as `data.audio_url`.
- A submission acknowledgment is not a finished result. Continue only when `finished` is true and `successful` is true.

Disable **Simplify** to receive the API response unchanged. Batch queries emit one item per task, preserving the relationship to the originating n8n input item.

## Billing, retries and errors

Generation uses your AceDataCloud balance. Check [current API documentation and pricing](https://platform.acedata.cloud/documents/nano-banana-images?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=nanobananan8n_readme_documents_nano_banana_images) before execution. `cost.amount` is in Credits, not USD; the conversion depends on your current package rate.

Each incoming n8n item sends one generation request. Creation is not retried automatically and the node does not substitute a different model. Re-running Create, enabling retry-on-fail, or restarting the workflow can create another paid task. After a timeout, retrieve the existing task where possible.

HTTP/authentication/parameter errors fail the node with the API's error context. Completed failed tasks are represented as `finished: true`, `successful: false` and an `error`, so downstream nodes can handle them. n8n's continue-on-fail option emits an error item and proceeds with later input items.

## Data handling and compatibility

Only configured text, model choices, media references and query parameters are sent to AceDataCloud. Input URLs must be accessible to the API. The node has no filesystem access, environment-variable access or telemetry, and no runtime dependencies beyond n8n's workflow API.

Built with the official `@n8n/node-cli`, strict community-package rules and Node.js 24. CI loads the package in current stable n8n **2.43.7**. Older n8n versions are not part of this release's compatibility test matrix. Icons are bundled from the existing Studio/service catalog; see [asset provenance](assets/README.md).

## Development

```sh
pnpm install --frozen-lockfile
pnpm run build
pnpm run lint
pnpm test
```

Programmatic nodes validate conditional media payloads, normalize asynchronous task responses and preserve input-item links. All service requests use n8n's authenticated HTTP helper. Unit tests mock the HTTP boundary; they do not incur generation charges.

Releases are built from merged source through GitHub Actions with `npm publish --provenance`. Publication runs build, lint and tests. Keep published versions immutable and update [CHANGELOG.md](CHANGELOG.md) for new releases.

## Resources and support

- [API documentation](https://platform.acedata.cloud/documents/nano-banana-images?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=nanobananan8n_readme_documents_nano_banana_images)
- [AceDataCloud Studio](https://studio.acedata.cloud?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=nanobananan8n_readme_platform)
- [Report an issue](https://github.com/AceDataCloud/NanoBananaN8N/issues)
- [n8n community-node documentation](https://docs.n8n.io/integrations/community-nodes/)

Include the package version, n8n version, operation and a redacted error when reporting issues. Never include API tokens or private media.
