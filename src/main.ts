import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    console.log("🔍 GitHub Anomaly Detection System Starting...\n");

    const app = await NestFactory.create(AppModule);

    // Get port from environment variable or use default
    const port = parseInt(process.env.PORT || "3000", 10);

    await app.listen(port);

    console.log(`🚀 Webhook server listening on port ${port}`);
    console.log(`📡 Webhook endpoint: http://localhost:${port}/webhook`);
    console.log(`💚 Health check: http://localhost:${port}/health`);
    console.log("\n✅ System ready. Waiting for webhook events...\n");
}

bootstrap();
