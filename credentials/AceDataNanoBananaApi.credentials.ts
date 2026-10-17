import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class AceDataNanoBananaApi implements ICredentialType {
  name = "aceDataNanoBananaApi";
  displayName = "Nano Banana by Ace Data Cloud API";
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
    {
      displayName:
        'Create or copy an application API key in <a href="https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=nanobananan8n_credential_api_key" target="_blank">Ace Data Cloud Applications</a>. Paste only the token into API Token; do not add Bearer.',
      name: "keySetup",
      type: "notice",
      default: "",
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
