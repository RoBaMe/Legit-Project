import { Injectable } from "@nestjs/common";
import { AnomalyDetection } from "../anomalies/AnomalyDetection";
import { INotifier } from "./INotifier";

@Injectable()
export class ConsoleNotifier implements INotifier {
    public notify(result: AnomalyDetection): void {
        console.log("\n⚠️  SUSPICIOUS BEHAVIOR DETECTED ⚠️");
        console.log("═".repeat(50));
        console.log(`Name: ${result.name}`);
        console.log(`Description: ${result.description}`);
        console.log(`Severity: ${result.severity}`);
        console.log(`Timestamp: ${result.timestamp.toISOString()}`);
        console.log("═".repeat(50));
        console.log("");
    }
}
