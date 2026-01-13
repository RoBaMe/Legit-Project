import { IDetector } from "./IDetector";
import { GitHubWebhookEvent, AnomalyDetectionResult } from "../types/github-webhook";

/**
 * Detects suspicious behavior: creating a team with prefix "hacker"
 */
export class TeamNameDetector implements IDetector {
    private readonly suspiciousPrefix = "hacker";

    public getName(): string {
        return "TeamNameDetector";
    }

    public detect(event: GitHubWebhookEvent, eventType: string): AnomalyDetectionResult | null {
        // Only check team creation events
        if (eventType !== "team" || event.action !== "created") {
            return null;
        }

        const teamName = event.team?.name?.toLowerCase() || "";

        if (teamName.startsWith(this.suspiciousPrefix.toLowerCase())) {
            return {
                isSuspicious: true,
                reason: `Team created with suspicious prefix "${this.suspiciousPrefix}": ${event.team?.name}`,
                event,
                timestamp: new Date(),
            };
        }

        return null;
    }
}
