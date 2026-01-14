import { Module } from "@nestjs/common";
import { WebhookController } from "./WebhookController";
import { WebhookService } from "./WebhookService";
import { LoggerService } from "../logger/LoggerService";
import { AnomaliesModule } from "../anomalies/anomalies.module";
import { NotificationsModule } from "../notifications/NotificationsModule";

@Module({
    imports: [AnomaliesModule, NotificationsModule],
    controllers: [WebhookController],
    providers: [WebhookService, LoggerService],
    exports: [WebhookService],
})
export class WebhookModule {}
