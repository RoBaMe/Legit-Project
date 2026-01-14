import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./Webhook.service";
import { LoggerService } from "../logger/Logger.service";
import { AnomaliesModule } from "../anomalies/Anomalies.module";
import { NotificationsModule } from "../notifications/Notifications.module";

@Module({
    imports: [AnomaliesModule, NotificationsModule],
    controllers: [WebhookController],
    providers: [WebhookService, LoggerService],
    exports: [WebhookService],
})
export class WebhookModule {}
