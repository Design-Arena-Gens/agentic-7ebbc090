'use client';

import { useMemo, useState } from "react";
import type { AgentDecision, Email } from "@/app/lib/types";

interface EmailAgentDashboardProps {
  initialEmails: Email[];
}

interface EmailWithDecision {
  email: Email;
  decision?: AgentDecision;
}

export function EmailAgentDashboard({
  initialEmails,
}: EmailAgentDashboardProps) {
  const [emails] = useState<Email[]>(initialEmails);
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedAt, setProcessedAt] = useState<string | null>(null);

  const rows: EmailWithDecision[] = useMemo(() => {
    return emails.map((email) => ({
      email,
      decision: decisions.find((decision) => decision.emailId === email.id),
    }));
  }, [emails, decisions]);

  const stats = useMemo(() => {
    const counts = decisions.reduce(
      (acc, decision) => {
        acc.total += 1;
        acc[decision.category] = (acc[decision.category] ?? 0) + 1;
        return acc;
      },
      {
        total: 0,
        important: 0,
        marketing: 0,
        transactional: 0,
        personal: 0,
      } as Record<string, number>,
    );

    return counts;
  }, [decisions]);

  const handleRunAgent = async () => {
    try {
      setProcessing(true);
      setError(null);

      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails }),
      });

      if (!response.ok) {
        throw new Error(`Agent failed with status ${response.status}`);
      }

      const data = (await response.json()) as {
        processedAt: string;
        decisions: AgentDecision[];
      };

      setDecisions(data.decisions);
      setProcessedAt(data.processedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-10">
      <header className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
            Autonomous Email Agent
          </p>
          <h1 className="mt-1 text-4xl font-semibold text-zinc-900">
            Formal reply automation & marketing unsubscribe
          </h1>
        </div>
        <p className="max-w-3xl text-base text-zinc-600">
          Run the agent to draft structured responses for important and
          time-sensitive conversations while automatically unsubscribing from
          marketing campaigns. All actions are auditable before forwarding to
          your email service.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleRunAgent}
            disabled={processing}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? "Processing…" : "Run agent on inbox"}
          </button>
          {processedAt && (
            <span className="text-sm text-zinc-500">
              Last processed {new Date(processedAt).toLocaleString()}
            </span>
          )}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-500">Total handled</span>
          <span className="text-2xl font-semibold text-zinc-900">
            {stats.total}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-500">Important replies</span>
          <span className="text-2xl font-semibold text-zinc-900">
            {stats.important}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-500">Marketing unsubscribed</span>
          <span className="text-2xl font-semibold text-zinc-900">
            {stats.marketing}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-500">Transactional flagged</span>
          <span className="text-2xl font-semibold text-zinc-900">
            {stats.transactional}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900">
          Inbox prioritization queue
        </h2>
        <div className="flex flex-col gap-4">
          {rows.map(({ email, decision }) => (
            <article
              key={email.id}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {email.senderName} · {email.senderEmail}
                  </p>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {email.subject}
                  </h3>
                </div>
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-600">
                  {decision ? decision.category : "pending"}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm text-zinc-600">
                {email.body}
              </p>

              {decision ? (
                <div className="mt-6 flex flex-col gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Summary
                    </p>
                    <p className="mt-1 font-medium">{decision.summary.headline}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {decision.summary.keyPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    {decision.actions.map((action) => {
                      if (action.type === "reply") {
                        return (
                          <div
                            key={`${decision.emailId}-reply`}
                            className="rounded-md border border-blue-200 bg-white p-4 text-blue-900 shadow-inner"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                              Draft reply ({Math.round(action.confidence * 100)}%
                              confidence)
                            </p>
                            <p className="mt-2 whitespace-pre-line text-sm">
                              {action.body}
                            </p>
                            <div className="mt-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                Follow-up tasks
                              </p>
                              <ul className="mt-1 list-disc space-y-1 pl-4">
                                {action.followUpTasks.map((task) => (
                                  <li key={task}>{task}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      }

                      if (action.type === "unsubscribe") {
                        return (
                          <div
                            key={`${decision.emailId}-unsubscribe`}
                            className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                              Marketing unsubscribe
                            </p>
                            <p className="mt-2 text-sm">
                              Status:{" "}
                              <span className="font-semibold capitalize">
                                {action.status.replace("_", " ")}
                              </span>
                            </p>
                            {action.link && (
                              <p className="mt-1 text-sm">
                                Link:{" "}
                                <a
                                  href={action.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline"
                                >
                                  {action.link}
                                </a>
                              </p>
                            )}
                            <p className="mt-1 text-xs text-emerald-700">
                              {action.rationale}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={`${decision.emailId}-flag`}
                          className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-900"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                            Flagged for review
                          </p>
                          <p className="mt-2 text-sm">{action.rationale}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
                  Awaiting agent processing. Click &quot;Run agent on inbox&quot;
                  to generate actions.
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
