import { Injectable } from "@nestjs/common";
import { AnomalyDetection } from "../AnomalyDetection";
import { WebhookEventType } from "../../utils/webhook-event-type.utils";
import { DetectorBase } from "./DetectorBase";
import { RepositoryEvent } from "@octokit/webhooks-types";

//TODO: Add fetch creation time from github api to detect deletion of existing repository
@Injectable()
export class RepositoryDeletionDetector extends DetectorBase {
    private readonly SUSPISIOUS_TIME_WINDOW_IN_MINUTES = 10;
    private repositoryCreationTimes: Map<number, Date> = new Map();

    constructor() {
        super({
            repository: [(event) => this.detectSuspiciousRepositoryDeletion(event)],
        });
    }

    public getRelevantEvents(): WebhookEventType[] {
        return ["repository"];
    }

    private detectSuspiciousRepositoryDeletion(event: RepositoryEvent): AnomalyDetection | null {
        if (event.action === "created") {
            this.repositoryCreationTimes.set(event.repository.id, new Date());
            return null;
        } else if (event.action === "deleted") {
            const creationTime = this.repositoryCreationTimes.get(event.repository.id);

            if (creationTime) {
                const timeDifferenceMinutes = this.timeDifferanceInMinutes(new Date(), creationTime);

                if (timeDifferenceMinutes < this.SUSPISIOUS_TIME_WINDOW_IN_MINUTES) {
                    this.repositoryCreationTimes.delete(event.repository.id);
                    return {
                        name: "Suspicious Repository Deletion",
                        description: `Repository "${event.repository.name}" was created and deleted within ${timeDifferenceMinutes} minutes`,
                        severity: "high",
                        timestamp: new Date(),
                    };
                }
            }
        }

        return null;
    }

    private timeDifferanceInMinutes(firstDate: Date, secondDate: Date): number {
        return Math.abs((firstDate.getTime() - secondDate.getTime()) / (1000 * 60));
    }
}
