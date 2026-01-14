import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from "@nestjs/common";
import { WebhookService } from "./Webhook.service";
import { LoggerService } from "../logger/Logger.service";
import { WebhookEvent } from "@octokit/webhooks-types";
import { WebhookEventType } from "../utils/WebhookEventTypeUtils";

@Controller("webhook")
export class WebhookController {
    constructor(
        private readonly webhookService: WebhookService,
        private readonly logger: LoggerService
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    handleWebhook(
        @Body() event: WebhookEvent,
        @Headers("x-github-event") eventType: WebhookEventType,
        @Headers("x-github-delivery") eventId: string,
        @Headers("X-GitHub-Hook-Installation-Target-ID") tragetId: string,
        @Headers("X-GitHub-Hook-Installation-Target-Type") targetType: string
    ) {
        try {
            this.logger.log(`Processing webhook event: ${eventId} from ${targetType} ${tragetId}`, "WebhookController");
            const result = this.webhookService.processWebhook(event, eventType);
            this.logger.log(
                `Finished Processing webhook event:${eventId} from ${targetType} ${tragetId}, Found ${result.anomaliesDetected} anomalies`,
                "WebhookController"
            );

            return { received: true, anomaliesDetected: result.anomaliesDetected };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error processing webhook: ${errorMessage}`, errorStack, "WebhookController");

            throw error;
        }
    }
}
