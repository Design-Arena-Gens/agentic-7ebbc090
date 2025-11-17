import { NextResponse } from "next/server";
import { processInbox } from "@/app/lib/emailAgent";
import { Email } from "@/app/lib/types";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as { emails?: Email[] };

    if (!payload.emails || !Array.isArray(payload.emails)) {
      return NextResponse.json(
        { error: "Invalid payload. Expected an `emails` array." },
        { status: 400 },
      );
    }

    const response = processInbox(payload.emails);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Agent processing failed:", error);
    return NextResponse.json(
      { error: "Unable to process inbox." },
      { status: 500 },
    );
  }
}
