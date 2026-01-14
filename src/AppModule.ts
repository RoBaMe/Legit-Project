import { Module } from "@nestjs/common";
import { AppController } from "./AppController";
import { WebhookModule } from "./webhook/WebhookModule";
import { LoggerService } from "./logger/LoggerService";

@Module({
    imports: [WebhookModule],
    controllers: [AppController],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class AppModule {}
