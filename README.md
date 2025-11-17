## Autonomous Email Agent

This project delivers a full-stack Next.js agent that prioritizes inbox triage by drafting formal responses for important correspondence and unsubscribing from marketing campaigns automatically. It ships with a sample inbox to demonstrate the orchestration workflow and can be wired to live email sources by forwarding payloads to the `/api/agent` route.

### Features

- Heuristic classification of important, marketing, transactional, and personal messages.
- Formal reply generation that highlights action items and follow-ups for high-priority emails.
- Automatic detection of unsubscribe links in marketing messages with rationale tracking.
- Transactional flagging to route receipts and confirmations for archiving.
- Auditable dashboard summarizing agent decisions and recommended steps.

### Running locally

```bash
npm install
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to review the dashboard. Click **Run agent on inbox** to process the sample dataset.

### Extending

- Connect your email ingestion pipeline and POST an `emails` array to `/api/agent` for processing.
- Replace the sample dataset in `app/data/sampleInbox.ts` with live data or integrate a database.
- Plug the reply payloads into your outbound email service and run unsubscribe links through a worker job.
