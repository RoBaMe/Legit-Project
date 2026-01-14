import { Module } from "@nestjs/common";
import { WebhookAnomaliesDetector } from "./WebhookAnomaliesDetector.service";
import { RepositoryDeletionDetector } from "./detectors/RepositoryDeletionDetector.service";
import { TeamNameDetector } from "./detectors/TeamNameDetector.service";
import { PushTimeDetector } from "./detectors/TimeBasedPushDetector.service";
import { DetectorBase } from "./detectors/DetectorBase";
import { DETECTORS } from "./DetectorsConstants";
import { LoggerService } from "../logger/LoggerService";

@Module({
    providers: [
        RepositoryDeletionDetector,
        TeamNameDetector,
        PushTimeDetector,
        {
            provide: DETECTORS,
            useFactory: (
                repositoryDeletionDetector: RepositoryDeletionDetector,
                teamNameDetector: TeamNameDetector,
                pushTimeDetector: PushTimeDetector
            ): DetectorBase[] => {
                return [repositoryDeletionDetector, teamNameDetector, pushTimeDetector];
            },
            inject: [RepositoryDeletionDetector, TeamNameDetector, PushTimeDetector],
        },
        WebhookAnomaliesDetector,
        LoggerService,
    ],
    exports: [WebhookAnomaliesDetector],
})
export class AnomaliesModule {}
