import { WebhookEventMap } from "@octokit/webhooks-types";

export type WebhookEventType = keyof WebhookEventMap;
