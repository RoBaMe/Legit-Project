import { AnomalyDetector } from "./detectors/AnomalyDetector";
import { TimeBasedPushDetector } from "./detectors/TimeBasedPushDetector";
import { TeamNameDetector } from "./detectors/TeamNameDetector";
import { RepositoryDeletionDetector } from "./detectors/RepositoryDeletionDetector";
import { ConsoleNotifier } from "./notifications/ConsoleNotifier";
import { WebhookServer } from "./server/webhook-server";

/**
 * Main entry point for the GitHub Anomaly Detection application
 */
function main(): void {
    console.log("🔍 GitHub Anomaly Detection System Starting...\n");

    // Initialize the anomaly detection system
    const detector = new AnomalyDetector();

    // Register all detectors
    detector.registerDetector(new TimeBasedPushDetector());
    detector.registerDetector(new TeamNameDetector());
    detector.registerDetector(new RepositoryDeletionDetector());

    // Initialize notifier
    const notifier = new ConsoleNotifier();

    // Get port from environment variable or use default
    const port = parseInt(process.env.PORT || "3000", 10);

    // Create and start webhook server
    const server = new WebhookServer(detector, notifier, port);
    server.start();

    console.log("\n✅ System ready. Waiting for webhook events...\n");
}

// Start the application
main();
