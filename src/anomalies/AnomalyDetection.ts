export interface AnomalyDetection {
    name: string;
    description: string;
    severity: "low" | "medium" | "high";
    timestamp: Date;
}
