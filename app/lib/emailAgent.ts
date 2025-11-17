import {
  AgentAction,
  AgentDecision,
  AgentResponse,
  Email,
  EmailCategory,
  EmailSummary,
  ReplyAction,
  UnsubscribeAction,
} from "./types";

const MARKETING_KEYWORDS = [
  "sale",
  "discount",
  "exclusive offer",
  "newsletter",
  "update",
  "promotion",
  "promo",
  "deal",
  "limited time",
  "coupon",
  "subscribe",
  "unsubscribe",
  "marketing",
];

const IMPORTANT_KEYWORDS = [
  "meeting",
  "invoice",
  "contract",
  "deadline",
  "action required",
  "follow up",
  "proposal",
  "review",
  "project",
  "urgent",
  "important",
  "approval",
  "deliverable",
];

const TRANSACTIONAL_KEYWORDS = [
  "receipt",
  "statement",
  "transaction",
  "payment",
  "confirmation",
  "order",
  "ticket",
  "booking",
];

interface ClassificationResult {
  category: EmailCategory;
  reason: string;
}

export function processInbox(emails: Email[]): AgentResponse {
  const decisions = emails.map((email) => processEmail(email));

  return {
    processedAt: new Date().toISOString(),
    decisions,
  };
}

function processEmail(email: Email): AgentDecision {
  const classification = classify(email);
  const summary = buildSummary(email);
  const priority = derivePriority(classification.category, email, summary);
  const actions = buildActions(email, classification);

  return {
    emailId: email.id,
    category: classification.category,
    priority,
    summary,
    actions,
  };
}

function classify(email: Email): ClassificationResult {
  const lowerContent = `${email.subject} ${email.body}`.toLowerCase();

  const hasMarketingSignal = MARKETING_KEYWORDS.some((keyword) =>
    lowerContent.includes(keyword),
  );
  if (hasMarketingSignal) {
    return {
      category: "marketing",
      reason: "Marketing keyword detected",
    };
  }

  const hasImportantSignal = IMPORTANT_KEYWORDS.some((keyword) =>
    lowerContent.includes(keyword),
  );
  if (hasImportantSignal) {
    return {
      category: "important",
      reason: "Contains formal or time-sensitive request",
    };
  }

  const hasTransactionalSignal = TRANSACTIONAL_KEYWORDS.some((keyword) =>
    lowerContent.includes(keyword),
  );
  if (hasTransactionalSignal) {
    return {
      category: "transactional",
      reason: "Transactional content detected",
    };
  }

  return {
    category: "personal",
    reason: "Default classification",
  };
}

function buildSummary(email: Email): EmailSummary {
  const sentences = splitSentences(email.body);
  const firstSentence = sentences[0] ?? "";
  const secondSentence = sentences[1] ?? "";

  const headline =
    email.subject ||
    truncate(firstSentence || email.body.slice(0, 80), 80).trim();

  const keyPoints = sentences
    .filter((sentence) => sentence.length > 0)
    .slice(0, 3)
    .map((sentence) => truncate(sentence.trim(), 120));

  if (keyPoints.length === 0) {
    keyPoints.push(truncate(firstSentence || secondSentence, 120));
  }

  return {
    headline,
    keyPoints,
  };
}

function derivePriority(
  category: EmailCategory,
  email: Email,
  summary: EmailSummary,
): "high" | "medium" | "low" {
  if (category === "important") {
    return "high";
  }

  if (category === "transactional") {
    return "medium";
  }

  const hasCallToAction = summary.keyPoints.some((point) =>
    /action|please|kindly|request|respond|confirm|review/i.test(point),
  );

  if (category === "personal" && hasCallToAction) {
    return "medium";
  }

  if (category === "marketing") {
    return "low";
  }

  return "medium";
}

function buildActions(
  email: Email,
  classification: ClassificationResult,
): AgentAction[] {
  const actions: AgentAction[] = [];

  if (classification.category === "important") {
    actions.push(buildReplyAction(email));
  }

  if (classification.category === "marketing") {
    actions.push(buildUnsubscribeAction(email));
  }

  if (classification.category === "transactional") {
    actions.push(buildFlagAction("medium", "Transactional record for archiving"));
  }

  return actions;
}

function buildReplyAction(email: Email): ReplyAction {
  const greeting = `Dear ${email.senderName || extractNameFromEmail(email.senderEmail)},`;
  const body = composeReplyBody(email);
  const closing = "\n\nBest regards,\nAutomated Correspondence Agent";

  return {
    type: "reply",
    subject: `Re: ${email.subject}`,
    tone: "formal",
    followUpTasks: deriveFollowUps(email),
    confidence: 0.86,
    rationale: "Important keywords detected; structured formal response generated.",
    body: `${greeting}\n\n${body}${closing}`,
  };
}

function buildUnsubscribeAction(email: Email): UnsubscribeAction {
  const link = extractUnsubscribeLink(email.body);

  if (link) {
    return {
      type: "unsubscribe",
      link,
      status: "completed",
      rationale: "Unsubscribe hyperlink discovered and action scheduled.",
    };
  }

  return {
    type: "unsubscribe",
    status: "not_found",
    rationale:
      "Marketing message detected but no unsubscribe path located. Manual review recommended.",
  };
}

function buildFlagAction(
  level: "high" | "medium" | "low",
  rationale: string,
): AgentAction {
  return {
    type: "flag",
    level,
    rationale,
  };
}

function composeReplyBody(email: Email): string {
  const keyPoints = extractKeyPoints(email.body);
  const acknowledgement = `Thank you for your message regarding "${email.subject}".`;
  const responseLines: string[] = [acknowledgement];

  if (keyPoints.length > 0) {
    responseLines.push("Here is my understanding of your key points:");
    keyPoints.forEach((point) => {
      responseLines.push(`- ${point}`);
    });
  }

  responseLines.push(
    "Please let me know if any clarification is required or if additional documentation would be helpful.",
  );

  return responseLines.join("\n");
}

function extractKeyPoints(body: string): string[] {
  const sentences = splitSentences(body);
  const actionable = sentences.filter((sentence) =>
    /(please|could you|can you|request|deadline|by\s+\d{1,2}\s+\w+)/i.test(
      sentence,
    ),
  );

  if (actionable.length > 0) {
    return actionable.map((sentence) => truncate(sentence.trim(), 100));
  }

  return sentences.slice(0, 2).map((sentence) => truncate(sentence.trim(), 100));
}

function deriveFollowUps(email: Email): string[] {
  const tasks: string[] = [];

  if (/\bdeadline\b|\bby (monday|tuesday|wednesday|thursday|friday|week\b)/i.test(email.body)) {
    tasks.push("Confirm delivery timeline and deadline alignment.");
  }

  if (/\battach(ed)?\b|\battachment\b/i.test(email.body)) {
    tasks.push("Verify that referenced attachments were received and reviewed.");
  }

  if (/\bmeeting\b|\bcall\b/i.test(email.body)) {
    tasks.push("Propose specific meeting slots within the next 48 hours.");
  }

  if (tasks.length === 0) {
    tasks.push("Acknowledge receipt and capture key commitments in CRM.");
  }

  return tasks;
}

function extractUnsubscribeLink(body: string): string | undefined {
  const linkMatch =
    body.match(/https?:\/\/[^\s"]*(unsubscribe|optout|preferences)[^\s"]*/i) ??
    body.match(/<a[^>]+href="([^"]+)"[^>]*>([^<]*unsubscribe[^<]*)<\/a>/i);

  if (!linkMatch) {
    return undefined;
  }

  if (linkMatch[1]) {
    return linkMatch[1];
  }

  return linkMatch[0];
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) {
    return text;
  }

  return `${text.slice(0, Math.max(maxLen - 3, 0))}...`;
}

function extractNameFromEmail(email: string): string {
  const [localPart] = email.split("@");
  return localPart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}
