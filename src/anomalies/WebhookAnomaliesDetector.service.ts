import { Inject, Injectable } from "@nestjs/common";
import { DetectorBase } from "./detectors/DetectorBase";
import { WebhookEventMap } from "@octokit/webhooks-types";
import { AnomalyDetection } from "./AnomalyDetection";
import { WebhookEventType } from "../utils/webhook-event-type.utils";
import { DETECTORS } from "./DetectorsConstants";

@Injectable()
export class WebhookAnomaliesDetector {
    private detectorsByRevelentEvent: Partial<Record<WebhookEventType, DetectorBase[]>> = {};

    constructor(@Inject(DETECTORS) private readonly detectors: DetectorBase[]) {
        this.detectors.forEach((detector) => this.registerDetector(detector, detector.getRelevantEvents()));
    }

    public registerDetector(detector: DetectorBase, relevantEvents: WebhookEventType[]): void {
        relevantEvents.forEach((event) => {
            if (!this.detectorsByRevelentEvent[event]) this.detectorsByRevelentEvent[event] = [];
            this.detectorsByRevelentEvent[event].push(detector);
        });
    }

    public handleEvent<T extends WebhookEventType>(event: WebhookEventMap[T], eventType: T): AnomalyDetection[] {
        const relevantDetectors = this.detectorsByRevelentEvent[eventType] || [];
        const results = relevantDetectors
            .map((detector) => detector.detectAnomalies(event, eventType))
            .filter((result) => result.length !== 0)
            .flat();

        return results;
    }
}
