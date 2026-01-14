import { Controller, Get } from "@nestjs/common";
import { LoggerService } from "./logger/LoggerService";

@Controller()
export class AppController {
    constructor(private readonly logger: LoggerService) {}

    @Get("health")
    getHealth() {
        this.logger.debug("Health check requested", "AppController");
        return { status: "ok" };
    }
}
