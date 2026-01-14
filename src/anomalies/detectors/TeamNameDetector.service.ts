import { Injectable } from "@nestjs/common";
import { AnomalyDetection } from "../AnomalyDetection";
import { WebhookEventType } from "../../utils/webhook-event-type.utils";
import { DetectorBase } from "./DetectorBase";
import { TeamEvent } from "@octokit/webhooks-types";

@Injectable()
export class TeamNameDetector extends DetectorBase {
    private readonly suspiciousPrefix = "hacker";

    constructor() {
        super({
            team: [(event) => this.detectSuspisiousTeamName(event)],
        });
    }

    public getRelevantEvents(): WebhookEventType[] {
        return ["team"];
    }

    public detectSuspisiousTeamName(event: TeamEvent): AnomalyDetection | null {
        if (event.action === "created") {
            const teamName = event.team.name.toLowerCase() || "";
            
            if (teamName.startsWith(this.suspiciousPrefix.toLowerCase())) {
                return {
                    name: "Suspicious Team Name",
                    description: `Team created with suspicious prefix "${this.suspiciousPrefix}": ${event.team.name}`,
                    severity: "high",
                    timestamp: new Date(),
                };
            }
        }

        return null;
    }
}
