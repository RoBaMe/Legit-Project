# GitHub Anomaly Detection System

A command-line application that detects and notifies suspicious behavior in a GitHub organization using webhooks.

## Features

The system detects the following suspicious behaviors:

1. **Time-based Push Detection**: Pushing code between 14:00-16:00
2. **Team Name Detection**: Creating a team with the prefix "hacker"
3. **Repository Deletion Detection**: Creating a repository and deleting it in less than 10 minutes

## Architecture

The application is designed with extensibility in mind:

- **Detector Pattern**: Each suspicious behavior has its own detector class implementing `IDetector`
- **Notifier Pattern**: Notification mechanisms implement `INotifier` (currently Console)
- **Event-Driven**: Receives GitHub webhook events and analyzes them in real-time

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

### 2. Build the Project

```bash
npm run build
```

### 3. Set Up GitHub Webhook

1. Create a GitHub organization (if you don't have one)
2. Go to your organization settings → Webhooks
3. Add a new webhook with the following settings:
   - **Payload URL**: Your public URL (from smee.io or ngrok - see step 4)
   - **Content type**: `application/json`
   - **Events**: Select "Let me select individual events" and choose:
     - Pushes
     - Repository
     - Team
   - **Active**: Checked

### 4. Set Up Local Webhook Tunneling

#### Option A: Using smee.io (Recommended)

1. Go to https://smee.io/
2. Click "Start a new channel"
3. Copy the webhook URL (e.g., `https://smee.io/xxxxx`)
4. Install smee-client globally: `npm install -g smee-client`
5. In a separate terminal, run: `smee -u https://smee.io/xxxxx --target http://localhost:3000/webhook`
6. Use the smee.io URL as your GitHub webhook payload URL

#### Option B: Using ngrok

1. Download ngrok from https://ngrok.com/
2. Run: `ngrok http 3000`
3. Copy the HTTPS forwarding URL (e.g., `https://xxxxx.ngrok.io`)
4. Use `https://xxxxx.ngrok.io/webhook` as your GitHub webhook payload URL

### 5. Run the Application

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
├── main.ts                 # Entry point
├── types/
│   └── github-webhook.ts  # TypeScript interfaces for GitHub events
├── detectors/
│   ├── IDetector.ts       # Detector interface
│   ├── AnomalyDetector.ts # Main detection coordinator
│   ├── TimeBasedPushDetector.ts
│   ├── TeamNameDetector.ts
│   └── RepositoryDeletionDetector.ts
├── notifications/
│   ├── INotifier.ts       # Notifier interface
│   └── ConsoleNotifier.ts # Console notification implementation
└── server/
    └── webhook-server.ts  # Express webhook server
```

## Extending the System

### Adding a New Detector

1. Create a new class implementing `IDetector`:

```typescript
export class MyNewDetector implements IDetector {
  getName(): string {
    return 'MyNewDetector';
  }

  detect(event: GitHubWebhookEvent, eventType: string): AnomalyDetectionResult | null {
    // Your detection logic here
    if (/* suspicious condition */) {
      return {
        isSuspicious: true,
        reason: 'Description of suspicious behavior',
        event,
        timestamp: new Date(),
      };
    }
    return null;
  }
}
```

2. Register it in `src/main.ts`:

```typescript
detector.registerDetector(new MyNewDetector());
```

### Adding a New Notifier

1. Create a new class implementing `INotifier`:

```typescript
export class EmailNotifier implements INotifier {
  notify(result: AnomalyDetectionResult): void {
    // Your notification logic here
  }
}
```

2. Use it in `src/main.ts` or make it configurable.

## Testing

To test the system:

1. **Time-based Push**: Push code to a repository between 14:00-16:00 (local time)
2. **Team Name**: Create a team with a name starting with "hacker" (e.g., "hacker-team")
3. **Repository Deletion**: Create a repository, wait less than 10 minutes, then delete it

## Notes

- The application uses your local system time for the time-based detector
- Repository deletion detection tracks repositories by ID in memory (resets on restart)
- All detectors run independently and can detect multiple anomalies from a single event

## License

MIT
