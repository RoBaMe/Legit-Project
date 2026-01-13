import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { LoggerService } from "../logger/logger.service";
import { GitHubWebhookEvent } from "../types/github-webhook";

@Controller("webhook")
export class WebhookController {
    constructor(
        private readonly webhookService: WebhookService,
        private readonly logger: LoggerService
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    handleWebhook(@Body() event: GitHubWebhookEvent, @Headers("x-github-event") eventType: string) {
        try {
            const result = this.webhookService.processWebhook(event, eventType || "");
            return { received: true, anomaliesDetected: result.anomaliesDetected };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error processing webhook: ${errorMessage}`, errorStack, "WebhookController");
            throw error;
        }
    }
}
