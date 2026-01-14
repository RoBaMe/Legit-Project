import { WebhookEventMap } from "@octokit/webhooks-types";
import { WebhookEventType } from "../../utils/WebhookEventTypeUtils";
import { AnomalyDetection } from "../AnomalyDetection";

export type AnomalyDetectionHandler<T extends WebhookEventType = WebhookEventType> = (
    event: WebhookEventMap[T]
) => AnomalyDetection | null;

export type HandlerByRevelentEvent = { [K in WebhookEventType]?: AnomalyDetectionHandler<K>[] };

export abstract class DetectorBase {
    protected handlerByRevelentEvent: HandlerByRevelentEvent;
    
    protected constructor(handlerByRevelentEvent: HandlerByRevelentEvent) {
        this.handlerByRevelentEvent = handlerByRevelentEvent;
    }

    public detectAnomalies<T extends WebhookEventType>(
        event: WebhookEventMap[T],
        eventType: T
    ): AnomalyDetection[] {
        const relevantHandlers = this.handlerByRevelentEvent[eventType] || [];
        const detections = relevantHandlers
            .map((handler) => handler(event))
            .filter((detection) => detection !== null);

        return detections;
    }

    public abstract getRelevantEvents(): WebhookEventType[];
}
