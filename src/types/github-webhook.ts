/**
 * GitHub Webhook Event Types
 */
export interface GitHubWebhookEvent {
    action: string;
    repository?: Repository;
    pusher?: Pusher;
    team?: Team;
    organization?: Organization;
    created_at?: string;
    deleted_at?: string;
    sender?: Sender;
    [key: string]: any;
}

export interface Repository {
    id: number;
    name: string;
    full_name: string;
    created_at: string;
    deleted_at?: string;
}

export interface Pusher {
    name: string;
    email: string;
}

export interface Team {
    id: number;
    name: string;
    slug: string;
}

export interface Organization {
    login: string;
    id: number;
}

export interface Sender {
    login: string;
    id: number;
}

export interface AnomalyDetectionResult {
    isSuspicious: boolean;
    reason: string;
    event: GitHubWebhookEvent;
    timestamp: Date;
}
