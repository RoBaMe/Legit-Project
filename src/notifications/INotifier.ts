import { AnomalyDetectionResult } from "../types/github-webhook";

/**
 * Interface for notification systems
 * Allows for extensible notification mechanisms (console, email, Slack, etc.)
 */
export interface INotifier {
    /**
     * Notify about a detected anomaly
     */
    notify(result: AnomalyDetectionResult): void;
}
