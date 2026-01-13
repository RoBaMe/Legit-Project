import { IDetector } from "./IDetector";
import { GitHubWebhookEvent, AnomalyDetectionResult } from "../types/github-webhook";

/**
 * Detects suspicious behavior: pushing code between 14:00-16:00
 */
export class TimeBasedPushDetector implements IDetector {
    private readonly suspiciousStartHour = 14;
    private readonly suspiciousEndHour = 16;

    public getName(): string {
        return "TimeBasedPushDetector";
    }

    public detect(event: GitHubWebhookEvent, eventType: string): AnomalyDetectionResult | null {
        // Only check push events
        if (eventType !== "push") {
            return null;
        }

        const now = new Date();
        const currentHour = now.getHours();

        // Check if current time is between 14:00-16:00
        if (currentHour >= this.suspiciousStartHour && currentHour < this.suspiciousEndHour) {
            return {
                isSuspicious: true,
                reason: `Code pushed between ${this.suspiciousStartHour}:00-${this.suspiciousEndHour}:00`,
                event,
                timestamp: now,
            };
        }

        return null;
    }
}
