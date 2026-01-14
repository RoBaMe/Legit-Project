# GitHub Anomaly Detection System

A command-line application that detects and notifies suspicious behavior in a GitHub organization using webhooks.

## Features

The system detects the following suspicious behaviors:

1. **Time-based Push Detection**: Pushing code between 14:00-16:00
2. **Team Name Detection**: Creating a team with the prefix "hacker"
3. **Repository Deletion Detection**: Creating a repository and deleting it in less than 10 minutes

## Architecture

The application is built with NestJS and designed with extensibility in mind:

- **NestJS Framework**: Uses NestJS for a scalable, modular architecture
- **Detector Pattern**: Each suspicious behavior has its own detector class extending `DetectorBase`
- **Notifier Pattern**: Notification mechanisms implement `INotifier` (currently Console)
- **Event-Driven**: Receives GitHub webhook events and analyzes them in real-time
- **Modular Design**: Organized into separate modules (Anomalies, Notifications, Webhook, Logger)
- **Automatic Registration**: Detectors are automatically discovered and registered via dependency injection

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A GitHub organization (you can create a free one)
- A tool for webhook tunneling (smee.io or ngrok) for local development

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Environment
NODE_ENV=development

# Logging
LOG_LEVEL=info

```

### 3. Build the Project

```bash
npm run build
```

### 4. Set Up GitHub Webhook

1. Create a GitHub organization (if you don't have one)
2. Go to your organization settings → Webhooks
3. Add a new webhook with the following settings:
    - **Payload URL**: Your public URL (from smee.io or ngrok - see step 5)
    - **Content type**: `application/json`
    - **Events**: Select "Let me select individual events" and choose:
        - Pushes
        - Repository
        - Team
    - **Active**: Checked

### 5. Set Up Local Webhook Tunneling

#### Using smee.io (Recommended)

1. Go to https://smee.io/
2. Click "Start a new channel"
3. Copy the webhook URL (e.g., `https://smee.io/xxxxx`)
4. Use the smee.io URL as your GitHub webhook payload URL

The application will automatically start the Smee client in development mode.

### 6. Run the Application

#### Development Mode (with TypeScript):

```bash
npm run dev
```

#### Production Mode (compiled):

```bash
npm run build
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Project Structure

```
src/
├── Main.ts                          # NestJS bootstrap entry point
├── App.module.ts                    # NestJS root module
├── App.controller.ts                # Health check controller
├── anomalies/
│   ├── Anomalies.module.ts          # Anomalies detection module
│   ├── AnomalyDetection.ts          # Anomaly detection result interface
│   ├── DetectorsConstants.ts        # Detector provider token
│   ├── WebhookAnomaliesDetector.service.ts  # Main detector coordinator
│   └── detectors/
│       ├── DetectorBase.ts          # Abstract base class for detectors
│       ├── RepositoryDeletionDetector.service.ts
│       ├── TeamNameDetector.service.ts
│       └── TimeBasedPushDetector.service.ts
├── notifications/
│   ├── Notifications.module.ts      # Notifications module
│   ├── NotificationsConstants.ts    # Notifier provider token
│   ├── INotifier.ts                 # Notifier interface
│   └── ConsoleNotifier.service.ts   # Console notification implementation
├── webhook/
│   ├── Webhook.module.ts            # Webhook module
│   ├── Webhook.controller.ts        # Webhook endpoint controller
│   └── Webhook.service.ts           # Webhook processing service
├── logger/
│   └── Logger.service.ts            # Winston-based logging service
└── utils/
    └── WebhookEventTypeUtils.ts     # Webhook event type utilities
```

## Extending the System

### Adding a New Detector

1. Create a new class extending `DetectorBase` in `src/anomalies/detectors/`:

```typescript
import { Injectable } from "@nestjs/common";
import { DetectorBase } from "./DetectorBase";
import { WebhookEventType } from "../../utils/WebhookEventTypeUtils";
import { AnomalyDetection } from "../AnomalyDetection";
import { PushEvent } from "@octokit/webhooks-types";

@Injectable()
export class MyNewDetector extends DetectorBase {
    constructor() {
        super({
            push: [(event) => this.detectSomething(event)],
        });
    }

    public getRelevantEvents(): WebhookEventType[] {
        return ["push"];
    }

    private detectSomething(event: PushEvent): AnomalyDetection | null {
        // Your detection logic here
        if (/* suspicious condition */) {
            return {
                name: "Suspicious Behavior Name",
                description: "Description of suspicious behavior",
                severity: "high",
                timestamp: new Date(),
            };
        }
        return null;
    }
}
```

2. Register it in `src/anomalies/Anomalies.module.ts`:
    - Add the detector to the `providers` array
    - Add it to the `DETECTORS` factory function
    - Add it to the `inject` array

The detector will be automatically discovered and registered by `WebhookAnomaliesDetector`.

### Adding a New Notifier

1. Create a new class implementing `INotifier` in `src/notifications/`:

```typescript
import { Injectable } from "@nestjs/common";
import { INotifier } from "./INotifier";
import { AnomalyDetection } from "../anomalies/AnomalyDetection";

@Injectable()
export class EmailNotifier implements INotifier {
    notify(result: AnomalyDetection): void {
        // Your notification logic here
        console.log(`Email sent: ${result.name}`);
    }
}
```

2. Register it in `src/notifications/Notifications.module.ts`:
    - Add the notifier to the `providers` array
    - Add it to the `NOTIFIERS` factory function
    - Add it to the `inject` array

The notifier will automatically be used when anomalies are detected.

## Testing

To test the system:

1. **Time-based Push**: Push code to a repository between 14:00-16:00 (local time)
2. **Team Name**: Create a team with a name starting with "hacker" (e.g., "hacker-team")
3. **Repository Deletion**: Create a repository, wait less than 10 minutes, then delete it

## Logging

The application uses Winston for logging and supports different log levels:

- `LOG_LEVEL=error` - Only errors
- `LOG_LEVEL=warn` - Warnings and errors
- `LOG_LEVEL=info` - Info, warnings, and errors (default)
- `LOG_LEVEL=debug` - All log levels including debug
- `LOG_LEVEL=verbose` - All log levels

Logs include timestamps, log levels, contexts, and formatted messages.

## Notes

- The application uses your local system time for the time-based detector
- Repository deletion detection tracks repositories by ID in memory (resets on restart)
- All detectors run independently and can detect multiple anomalies from a single event
- The system uses TypeScript with strict type checking for better code safety
- File naming follows PascalCase convention (e.g., `WebhookController.ts`, `LoggerService.ts`)

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run dev` - Run in development mode with TypeScript
- `npm run watch` - Watch for changes and recompile
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## License

MIT
