import { INotifier } from "./INotifier";
import { AnomalyDetectionResult } from "../types/github-webhook";

/**
 * Console-based notifier for detected anomalies
 */
export class ConsoleNotifier implements INotifier {
    public notify(result: AnomalyDetectionResult): void {
        console.log("\n⚠️  SUSPICIOUS BEHAVIOR DETECTED ⚠️");
        console.log("═".repeat(50));
        console.log(`Reason: ${result.reason}`);
        console.log(`Timestamp: ${result.timestamp.toISOString()}`);
        console.log(`Event Type: ${result.event.action || "unknown"}`);

        if (result.event.repository) {
            console.log(
                `Repository: ${result.event.repository.full_name || result.event.repository.name}`
            );
        }

        if (result.event.team) {
            console.log(`Team: ${result.event.team.name}`);
        }

        if (result.event.pusher) {
            console.log(`Pusher: ${result.event.pusher.name}`);
        }

        console.log("═".repeat(50));
        console.log("");
    }
}
