import { Inject, Injectable } from "@nestjs/common";
import { WebhookAnomaliesDetector } from "../anomalies/WebhookAnomaliesDetector.service";
import { LoggerService } from "../logger/Logger.service";
import { WebhookEvent } from "@octokit/webhooks-types";
import { WebhookEventType } from "../utils/WebhookEventTypeUtils";
import { NOTIFIERS } from "../notifications/NotificationsConstants";
import { INotifier } from "../notifications/INotifier";

@Injectable()
export class WebhookService {
    constructor(
        private readonly detector: WebhookAnomaliesDetector,
        @Inject(NOTIFIERS) private readonly notifiers: INotifier[],
        private readonly logger: LoggerService
    ) {}

    processWebhook(event: WebhookEvent, eventType: WebhookEventType): { anomaliesDetected: number } {
        this.logger.debug(`Processing webhook event: ${eventType}`, "WebhookService");

        const anomalies = this.detector.handleEvent(event, eventType);

        anomalies.forEach((anomaly) => this.notifiers.forEach((notifier) => notifier.notify(anomaly)));

        if (anomalies.length > 0) {
            this.logger.warn(`Detected ${anomalies.length} anomaly/anomalies in ${eventType} event`, "WebhookService");
        } else {
            this.logger.debug(`No anomalies detected in ${eventType} event`, "WebhookService");
        }

        return { anomaliesDetected: anomalies.length };
    }
}
