import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class AceDataNanoBananaApi implements ICredentialType {
  name = "aceDataNanoBananaApi";
  displayName = "Nano Banana by AceDataCloud API";
  documentationUrl =
    "https://github.com/AceDataCloud/NanoBananaN8N#credentials";
  icon = "file:../nodes/NanoBanana/icon.png" as const;
  properties: INodeProperties[] = [
    {
      displayName: "API Token",
      name: "apiToken",
      type: "string",
      typeOptions: { password: true },
      default: "",
      required: true,
      description: "Your AceDataCloud application API token",
    },
  ];
  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: { Authorization: "=Bearer {{$credentials.apiToken}}" },
    },
  };
  test: ICredentialTestRequest = {
    request: {
      baseURL: "https://api.acedata.cloud",
      url: "/nano-banana/tasks",
      method: "POST",
      body: { action: "retrieve_batch", ids: [] },
    },
  };
}
