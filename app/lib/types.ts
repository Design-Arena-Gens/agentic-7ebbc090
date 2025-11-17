export type EmailCategory = "important" | "marketing" | "transactional" | "personal";

export interface Email {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  receivedAt: string;
  tags?: string[];
}

export interface EmailSummary {
  headline: string;
  keyPoints: string[];
}

export interface ReplyAction {
  type: "reply";
  subject: string;
  body: string;
  tone: "formal" | "neutral";
  followUpTasks: string[];
  confidence: number;
  rationale: string;
}

export interface UnsubscribeAction {
  type: "unsubscribe";
  link?: string;
  status: "completed" | "pending" | "not_found";
  rationale: string;
}

export interface FlagAction {
  type: "flag";
  level: "high" | "medium" | "low";
  rationale: string;
}

export type AgentAction = ReplyAction | UnsubscribeAction | FlagAction;

export interface AgentDecision {
  emailId: string;
  category: EmailCategory;
  priority: "high" | "medium" | "low";
  summary: EmailSummary;
  actions: AgentAction[];
}

export interface AgentResponse {
  processedAt: string;
  decisions: AgentDecision[];
}
