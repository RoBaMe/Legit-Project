import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { LoggerService } from "../logger/logger.service";
import { AnomaliesModule } from "../anomalies/anomalies.module";
import { NotificationsModule } from "../notifications/NotificationsModule";

@Module({
    imports: [AnomaliesModule, NotificationsModule],
    controllers: [WebhookController],
    providers: [WebhookService, LoggerService],
    exports: [WebhookService],
})
export class WebhookModule {}
