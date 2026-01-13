import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { LoggerService } from "../logger/logger.service";
import { AnomalyDetector } from "../detectors/AnomalyDetector";
import { TimeBasedPushDetector } from "../detectors/TimeBasedPushDetector";
import { TeamNameDetector } from "../detectors/TeamNameDetector";
import { RepositoryDeletionDetector } from "../detectors/RepositoryDeletionDetector";
import { ConsoleNotifier } from "../notifications/ConsoleNotifier";

@Module({
    controllers: [WebhookController],
    providers: [
        WebhookService,
        LoggerService,
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
    exports: [WebhookService],
})
export class WebhookModule {}
