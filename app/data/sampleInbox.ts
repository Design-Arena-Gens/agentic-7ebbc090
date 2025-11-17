import { Email } from "../lib/types";

export const sampleInbox: Email[] = [
  {
    id: "1",
    senderName: "Elaine Roberts",
    senderEmail: "elaine.roberts@corporate-ae.com",
    subject: "Project Delta Milestone Review",
    body: `Hello,

Thank you for the updated project artifact package. Could you prepare a concise briefing outlining:
- the decision points that need VP sign-off,
- a summary of outstanding risks, and
- confirmation that we remain on track for the 28 March deployment date?

Please circulate the pre-read by Thursday so the steering committee has time to review ahead of the Friday meeting.

Regards,
Elaine`,
    receivedAt: "2024-03-14T14:12:00.000Z",
    tags: ["project", "client"],
  },
  {
    id: "2",
    senderName: "Modern Threads",
    senderEmail: "newsletter@modernthreads.com",
    subject: "Spring Preview Exclusive + 30% Off",
    body: `Hi there,

Your exclusive preview of the Modern Threads Spring Capsule is live! For 72 hours only, enjoy 30% off sitewide with code BLOOM30.

Browse the collection: https://modernthreads.com/spring-preview

Don't want these updates? Unsubscribe instantly: https://modernthreads.com/preferences/unsubscribe

Happy shopping!`,
    receivedAt: "2024-03-14T09:03:00.000Z",
    tags: ["marketing"],
  },
  {
    id: "3",
    senderName: "Marcus Lee",
    senderEmail: "marcus.lee@finclarity.io",
    subject: "Q1 Budget Variance Follow-up",
    body: `Hi,

Following our finance sync, could you confirm the corrective actions for the Q1 variance by end of day Wednesday?

Specifically:
1. What adjustments will we apply to the April run rate?
2. Can you share the revised forecast model for leadership review?

Thanks,
Marcus`,
    receivedAt: "2024-03-13T18:44:00.000Z",
    tags: ["finance", "follow-up"],
  },
  {
    id: "4",
    senderName: "Northwind Logistics",
    senderEmail: "support@northwindlogistics.com",
    subject: "Shipment NW-8421 Dispatched",
    body: `Good news!

Order NW-8421 has been dispatched and is scheduled to arrive on Monday, 18 March. You can track the shipment here:
https://northwindlogistics.com/track/NW-8421

Thank you for choosing us.`,
    receivedAt: "2024-03-13T12:10:00.000Z",
    tags: ["transactional"],
  },
  {
    id: "5",
    senderName: "FocusFitness",
    senderEmail: "offers@focusfitness.io",
    subject: "Renew your membership & save 40%",
    body: `Great news!

We're offering a 40% discount on all annual memberships for a limited time. Renew now to lock in exclusive perks.

To stop receiving these emails, click here: https://focusfitness.io/unsubscribe

Thanks for being part of the FocusFitness community.`,
    receivedAt: "2024-03-12T07:22:00.000Z",
    tags: ["marketing"],
  },
];
