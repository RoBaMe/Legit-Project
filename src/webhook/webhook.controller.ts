import { Controller, Post, Get, Body, Headers, HttpCode, HttpStatus } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { GitHubWebhookEvent } from "../types/github-webhook";

@Controller()
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}

    @Get("health")
    getHealth() {
        return { status: "ok" };
    }

    @Post("webhook")
    @HttpCode(HttpStatus.OK)
    handleWebhook(@Body() event: GitHubWebhookEvent, @Headers("x-github-event") eventType: string) {
        const result = this.webhookService.processWebhook(event, eventType || "");
        return { received: true, anomaliesDetected: result.anomaliesDetected };
    }
}
