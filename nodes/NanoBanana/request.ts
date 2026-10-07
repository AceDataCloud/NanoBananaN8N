import type { IDataObject, IExecuteFunctions } from "n8n-workflow";
import {
  callback,
  choice,
  integer,
  object,
  requiredText,
  imageUrls,
} from "./helpers";
export function buildRequest(
  context: IExecuteFunctions,
  index: number,
): { endpoint: string; body: IDataObject; headers?: IDataObject } {
  const get = (name: string, fallback?: unknown) =>
    context.getNodeParameter(name, index, fallback as IDataObject);
  const operation = String(get("operation"));
  const options = object(get("options", {}));

  const action = choice(operation, "Operation", ["generate", "edit"]);
  const model = choice(get("model"), "Model", [
    "nano-banana",
    "nano-banana-2-lite",
    "nano-banana-2",
    "nano-banana-pro",
    "nano-banana:official",
    "nano-banana-2-lite:official",
    "nano-banana-2:official",
    "nano-banana-pro:official",
  ]);
  const resolution = choice(get("resolution", "1K"), "Resolution", [
    "1K",
    "2K",
    "4K",
  ]);
  if (model.startsWith("nano-banana-2-lite") && resolution !== "1K")
    throw new Error("Nano Banana 2 Lite supports only 1K resolution");
  const body: IDataObject = {
    action,
    model,
    prompt: requiredText(get("prompt"), "Prompt"),
    count: integer(get("count", 1), "Number of Images", 1, 4),
    aspect_ratio: choice(get("aspectRatio", "1:1"), "Aspect Ratio", [
      "1:1",
      "3:2",
      "2:3",
      "16:9",
      "9:16",
      "4:3",
      "3:4",
    ]),
    resolution,
    async: true,
  };
  if (action === "edit")
    body.image_urls = imageUrls(get("imageUrls"), 1, 16, true);
  callback(options, body);
  return { endpoint: "/nano-banana/images", body };
}
