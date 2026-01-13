import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook/webhook.controller";
import { WebhookService } from "./webhook/webhook.service";
import { AnomalyDetector } from "./detectors/AnomalyDetector";
import { TimeBasedPushDetector } from "./detectors/TimeBasedPushDetector";
import { TeamNameDetector } from "./detectors/TeamNameDetector";
import { RepositoryDeletionDetector } from "./detectors/RepositoryDeletionDetector";
import { ConsoleNotifier } from "./notifications/ConsoleNotifier";

@Module({
    controllers: [WebhookController],
    providers: [
        WebhookService,
        {
            provide: "AnomalyDetector",
            useFactory: () => {
                const detector = new AnomalyDetector();
                detector.registerDetector(new TimeBasedPushDetector());
                detector.registerDetector(new TeamNameDetector());
                detector.registerDetector(new RepositoryDeletionDetector());
                return detector;
            },
        },
        {
            provide: "ConsoleNotifier",
            useClass: ConsoleNotifier,
        },
    ],
})
export class AppModule {}
