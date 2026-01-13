import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { WebhookModule } from "./webhook/webhook.module";
import { LoggerService } from "./logger/logger.service";

@Module({
    imports: [WebhookModule],
    controllers: [AppController],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class AppModule {}
