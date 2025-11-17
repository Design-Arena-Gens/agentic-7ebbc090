import { EmailAgentDashboard } from "@/app/components/EmailAgentDashboard";
import { sampleInbox } from "@/app/data/sampleInbox";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-4 pb-16 pt-20 font-sans text-zinc-900">
      <EmailAgentDashboard initialEmails={sampleInbox} />
    </div>
  );
}
