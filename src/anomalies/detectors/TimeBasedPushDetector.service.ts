import { Injectable } from "@nestjs/common";
import { AnomalyDetection } from "../AnomalyDetection";
import { WebhookEventType } from "../../utils/WebhookEventTypeUtils";
import { DetectorBase } from "./DetectorBase";
import { PushEvent } from "@octokit/webhooks-types";

@Injectable()
export class PushTimeDetector extends DetectorBase {
    private readonly SUSPISIOUS_START_HOUR = 14;
    private readonly SUSPISIOUS_END_HOUR = 16;

    constructor() {
        super({
            push: [(event) => this.detectSuspisiousPushTime(event)],
        });
    }

    public getRelevantEvents(): WebhookEventType[] {
        return ["push"];
    }

    public detectSuspisiousPushTime(event: PushEvent): AnomalyDetection | null {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour >= this.SUSPISIOUS_START_HOUR && currentHour < this.SUSPISIOUS_END_HOUR) {
            return {
                name: "Suspicious Push Time",
                description: `Code pushed by ${event.pusher.name} in repository ${event.repository.name} between ${this.SUSPISIOUS_START_HOUR}:00-${this.SUSPISIOUS_END_HOUR}:00: ${now.toISOString()}`,
                severity: "high",
                timestamp: now,
            };
        }

        return null;
    }
}
