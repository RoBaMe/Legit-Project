import { IDetector } from "./IDetector";
import { GitHubWebhookEvent, AnomalyDetectionResult } from "../types/github-webhook";

/**
 * Main anomaly detection system that coordinates multiple detectors
 */
export class AnomalyDetector {
    private detectors: IDetector[] = [];

    /**
     * Register a new detector
     */
    public registerDetector(detector: IDetector): void {
        this.detectors.push(detector);
    }

    /**
     * Analyze an event using all registered detectors
     * @returns Array of detected anomalies (empty if none)
     */
    public analyze(event: GitHubWebhookEvent, eventType: string): AnomalyDetectionResult[] {
        const results: AnomalyDetectionResult[] = [];

        for (const detector of this.detectors) {
            const result = detector.detect(event, eventType);
            if (result) {
                results.push(result);
            }
        }

        return results;
    }

    /**
     * Get all registered detectors
     */
    public getDetectors(): IDetector[] {
        return [...this.detectors];
    }
}
