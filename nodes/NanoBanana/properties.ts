import type { INodeProperties } from 'n8n-workflow';
export const properties: INodeProperties[] = [
  {
    "displayName": "Resource",
    "name": "resource",
    "type": "options",
    "default": "image",
    "options": [
      {
        "name": "Image",
        "value": "image"
      },
      {
        "name": "Task",
        "value": "task"
      }
    ],
    "noDataExpression": true
  },
  {
    "displayName": "Operation",
    "name": "operation",
    "type": "options",
    "default": "generate",
    "displayOptions": {
      "show": {
        "resource": [
          "image"
        ]
      }
    },
    "options": [
      {
        "name": "Edit",
        "value": "edit",
        "description": "Edit or combine reference images",
        "action": "Edit an image"
      },
      {
        "name": "Generate",
        "value": "generate",
        "description": "Generate images from a prompt",
        "action": "Generate an image"
      }
    ],
    "noDataExpression": true
  },
  {
    "displayName": "Operation",
    "name": "operation",
    "type": "options",
    "default": "get",
    "displayOptions": {
      "show": {
        "resource": [
          "task"
        ]
      }
    },
    "options": [
      {
        "name": "Get",
        "value": "get",
        "description": "Retrieve one existing task",
        "action": "Get a task"
      },
      {
        "name": "Get Many",
        "value": "getMany",
        "description": "Retrieve up to 50 specific task IDs",
        "action": "Get many tasks"
      }
    ],
    "noDataExpression": true
  },
  {
    "displayName": "Task ID",
    "name": "taskId",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "task"
        ],
        "operation": [
          "get"
        ]
      }
    },
    "required": true,
    "description": "The task ID returned by a generation operation"
  },
  {
    "displayName": "Task IDs",
    "name": "taskIds",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "task"
        ],
        "operation": [
          "getMany"
        ]
      }
    },
    "required": true,
    "description": "Up to 50 comma-separated task IDs"
  },
  {
    "displayName": "Prompt",
    "name": "prompt",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "image"
        ]
      }
    },
    "required": true,
    "typeOptions": {
      "rows": 4
    },
    "description": "Describe the result you want to create"
  },
  {
    "displayName": "Model",
    "name": "model",
    "type": "options",
    "default": "nano-banana",
    "displayOptions": {
      "show": {
        "resource": [
          "image"
        ]
      }
    },
    "options": [
      {
        "name": "nano-banana",
        "value": "nano-banana"
      },
      {
        "name": "nano-banana-2",
        "value": "nano-banana-2"
      },
      {
        "name": "nano-banana-2-lite",
        "value": "nano-banana-2-lite"
      },
      {
        "name": "nano-banana-2-lite:official",
        "value": "nano-banana-2-lite:official"
      },
      {
        "name": "nano-banana-2:official",
        "value": "nano-banana-2:official"
      },
      {
        "name": "nano-banana-pro",
        "value": "nano-banana-pro"
      },
      {
        "name": "nano-banana-pro:official",
        "value": "nano-banana-pro:official"
      },
      {
        "name": "nano-banana:official",
        "value": "nano-banana:official"
      }
    ]
  },
  {
    "displayName": "Image URLs",
    "name": "imageUrls",
    "type": "string",
    "default": "",
    "displayOptions": {
      "show": {
        "resource": [
          "image"
        ],
        "operation": [
          "edit"
        ]
      }
    },
    "required": true,
    "typeOptions": {
      "rows": 3
    },
    "description": "Reference image URLs, one per line. HTTPS URLs or image data URLs are supported."
  },
  {
    "displayName": "Number of Images",
    "name": "count",
    "type": "number",
    "default": 1,
    "displayOptions": {
      "show": {
        "resource": [
          "image"
        ]
      }
    },
    "typeOptions": {
      "minValue": 1,
      "maxValue": 4,
      "numberPrecision": 0
    }
  },
  {
    "displayName": "Aspect Ratio",
    "name": "aspectRatio",
    "type": "options",
    "default": "1:1",
    "displayOptions": {
      "show": {
        "resource": [
          "image"
        ]
      }
    },
    "options": [
      {
        "name": "1:1",
        "value": "1:1"
      },
      {
        "name": "16:9",
        "value": "16:9"
      },
      {
        "name": "2:3",
        "value": "2:3"
      },
      {
        "name": "3:2",
        "value": "3:2"
      },
      {
        "name": "3:4",
        "value": "3:4"
      },
      {
        "name": "4:3",
        "value": "4:3"
      },
      {
        "name": "9:16",
        "value": "9:16"
      }
    ]
  },
  {
    "displayName": "Resolution",
    "name": "resolution",
    "type": "options",
    "default": "1K",
    "displayOptions": {
      "show": {
        "resource": [
          "image"
        ]
      }
    },
    "options": [
      {
        "name": "1K",
        "value": "1K"
      },
      {
        "name": "2K",
        "value": "2K"
      },
      {
        "name": "4K",
        "value": "4K"
      }
    ],
    "description": "Nano Banana 2 Lite supports only 1K"
  },
  {
    "displayName": "Options",
    "name": "options",
    "type": "collection",
    "default": {},
    "displayOptions": {
      "show": {
        "resource": [
          "image"
        ]
      }
    },
    "placeholder": "Add Option",
    "options": [
      {
        "displayName": "Callback URL",
        "name": "callbackUrl",
        "type": "string",
        "default": "",
        "description": "Optional HTTPS webhook to receive the final result"
      }
    ]
  },
  {
    "displayName": "Simplify",
    "name": "simplify",
    "type": "boolean",
    "default": true,
    "description": "Whether to return essential fields instead of the raw API response"
  }
];
