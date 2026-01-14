import { AnomalyDetection } from "../anomalies/AnomalyDetection";


export interface INotifier {
    notify(result: AnomalyDetection): void;
}
