import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import SmeeClient from "smee-client";
import { AppModule } from "./AppModule";
import { LoggerService } from "./logger/LoggerService";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = app.get(LoggerService);

    logger.log("🔍 GitHub Anomaly Detection System Starting...", "Bootstrap");

    const port = parseInt(process.env.PORT || "3000", 10);

    await app.listen(port);

    logger.log(`🚀 Webhook server listening on port ${port}`, "Bootstrap");
    logger.log(`📡 Webhook endpoint: http://localhost:${port}/webhook`, "Bootstrap");
    logger.log(`💚 Health check: http://localhost:${port}/health`, "Bootstrap");
    logger.log("✅ System ready. Waiting for webhook events...", "Bootstrap");

    if (process.env.NODE_ENV === "development") {
        logger.log("Starting Smee client", "Bootstrap");
        const smee = new SmeeClient({
            source: "https://smee.io/8Im9cGTJaYMTBEJ",
            target: "http://localhost:3000/webhook",
            logger: console,
        });

        smee.start();
    }
}

bootstrap();
