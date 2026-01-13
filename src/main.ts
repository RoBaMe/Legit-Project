import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoggerService } from "./logger/logger.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = app.get(LoggerService);

    logger.log("🔍 GitHub Anomaly Detection System Starting...", "Bootstrap");

    // Get port from environment variable or use default
    const port = parseInt(process.env.PORT || "3000", 10);

    await app.listen(port);

    logger.log(`🚀 Webhook server listening on port ${port}`, "Bootstrap");
    logger.log(`📡 Webhook endpoint: http://localhost:${port}/webhook`, "Bootstrap");
    logger.log(`💚 Health check: http://localhost:${port}/health`, "Bootstrap");
    logger.log("✅ System ready. Waiting for webhook events...", "Bootstrap");
}

bootstrap();
