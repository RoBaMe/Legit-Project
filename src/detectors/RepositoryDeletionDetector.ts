import { IDetector } from "./IDetector";
import { GitHubWebhookEvent, AnomalyDetectionResult } from "../types/github-webhook";

/**
 * Detects suspicious behavior: creating a repository and deleting it in less than 10 minutes
 */
export class RepositoryDeletionDetector implements IDetector {
    private readonly suspiciousTimeWindowMinutes = 10;
    private repositoryCreationTimes: Map<number, Date> = new Map();

    public getName(): string {
        return "RepositoryDeletionDetector";
    }

    public detect(event: GitHubWebhookEvent, eventType: string): AnomalyDetectionResult | null {
        if (!event.repository) {
            return null;
        }

        const repoId = event.repository.id;
        const now = new Date();

        // Track repository creation
        if (eventType === "repository" && event.action === "created") {
            this.repositoryCreationTimes.set(repoId, now);
            return null;
        }

        // Check repository deletion
        if (eventType === "repository" && event.action === "deleted") {
            const creationTime = this.repositoryCreationTimes.get(repoId);

            if (creationTime) {
                const timeDifferenceMinutes =
                    (now.getTime() - creationTime.getTime()) / (1000 * 60);

                if (timeDifferenceMinutes < this.suspiciousTimeWindowMinutes) {
                    // Clean up the tracking map
                    this.repositoryCreationTimes.delete(repoId);

                    return {
                        isSuspicious: true,
                        reason: `Repository "${event.repository.name}" was created and deleted within ${this.suspiciousTimeWindowMinutes} minutes`,
                        event,
                        timestamp: now,
                    };
                }

                // Clean up old entries
                this.repositoryCreationTimes.delete(repoId);
            }
        }

        return null;
    }
}
