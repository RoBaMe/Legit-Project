import { Injectable, Inject } from "@nestjs/common";
import { AnomalyDetector } from "../detectors/AnomalyDetector";
import { INotifier } from "../notifications/INotifier";
import { LoggerService } from "../logger/logger.service";
import { GitHubWebhookEvent, AnomalyDetectionResult } from "../types/github-webhook";

@Injectable()
export class WebhookService {
    constructor(
        @Inject("AnomalyDetector") private readonly detector: AnomalyDetector,
        @Inject("ConsoleNotifier") private readonly notifier: INotifier,
        private readonly logger: LoggerService
    ) {}

    processWebhook(event: GitHubWebhookEvent, eventType: string): { anomaliesDetected: number } {
        this.logger.debug(`Processing webhook event: ${eventType}`, "WebhookService");

        // Analyze the event for suspicious behavior
        const anomalies = this.detector.analyze(event, eventType);

        // Notify about each detected anomaly
        anomalies.forEach((anomaly) => {
            this.notifier.notify(anomaly);
        });

        if (anomalies.length > 0) {
            this.logger.warn(
                `Detected ${anomalies.length} anomaly/anomalies in ${eventType} event`,
                "WebhookService"
            );
        }

        return { anomaliesDetected: anomalies.length };
    }
}
