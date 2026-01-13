import { Injectable, Inject } from "@nestjs/common";
import { AnomalyDetector } from "../detectors/AnomalyDetector";
import { INotifier } from "../notifications/INotifier";
import { GitHubWebhookEvent, AnomalyDetectionResult } from "../types/github-webhook";

@Injectable()
export class WebhookService {
    constructor(
        @Inject("AnomalyDetector") private readonly detector: AnomalyDetector,
        @Inject("ConsoleNotifier") private readonly notifier: INotifier
    ) {}

    processWebhook(event: GitHubWebhookEvent, eventType: string): { anomaliesDetected: number } {
        // Analyze the event for suspicious behavior
        const anomalies = this.detector.analyze(event, eventType);

        // Notify about each detected anomaly
        anomalies.forEach((anomaly) => {
            this.notifier.notify(anomaly);
        });

        return { anomaliesDetected: anomalies.length };
    }
}
