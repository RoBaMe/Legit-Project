import express, { Express, Request, Response } from "express";
import { GitHubWebhookEvent } from "../types/github-webhook";
import { AnomalyDetector } from "../detectors/AnomalyDetector";
import { INotifier } from "../notifications/INotifier";

/**
 * Webhook server that receives GitHub webhook events
 */
export class WebhookServer {
    private app: Express;
    private detector: AnomalyDetector;
    private notifier: INotifier;
    private port: number;

    constructor(detector: AnomalyDetector, notifier: INotifier, port: number = 3000) {
        this.app = express();
        this.detector = detector;
        this.notifier = notifier;
        this.port = port;
        this.setupRoutes();
    }

    private setupRoutes(): void {
        // Middleware to parse JSON bodies
        this.app.use(express.json());

        // Health check endpoint
        this.app.get("/health", (_req: Request, res: Response) => {
            res.json({ status: "ok" });
        });

        // Webhook endpoint
        this.app.post("/webhook", (req: Request, res: Response) => {
            try {
                const eventType = req.headers["x-github-event"] as string;
                const event: GitHubWebhookEvent = req.body;

                // Analyze the event for suspicious behavior
                const anomalies = this.detector.analyze(event, eventType);

                // Notify about each detected anomaly
                anomalies.forEach((anomaly) => {
                    this.notifier.notify(anomaly);
                });

                // Always return 200 to acknowledge receipt
                res.status(200).json({ received: true, anomaliesDetected: anomalies.length });
            } catch (error) {
                console.error("Error processing webhook:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`🚀 Webhook server listening on port ${this.port}`);
            console.log(`📡 Webhook endpoint: http://localhost:${this.port}/webhook`);
            console.log(`💚 Health check: http://localhost:${this.port}/health`);
        });
    }
}
