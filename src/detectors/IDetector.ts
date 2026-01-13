import { GitHubWebhookEvent, AnomalyDetectionResult } from "../types/github-webhook";

/**
 * Interface for anomaly detectors
 * Each detector is responsible for detecting a specific type of suspicious behavior
 */
export interface IDetector {
    /**
     * Detects if the given event represents suspicious behavior
     * @param event The GitHub webhook event to analyze
     * @returns AnomalyDetectionResult if suspicious behavior is detected, null otherwise
     */
    detect(event: GitHubWebhookEvent, eventType: string): AnomalyDetectionResult | null;

    /**
     * Returns the name/identifier of this detector
     */
    getName(): string;
}
