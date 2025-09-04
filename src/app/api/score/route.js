import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service key (keep secret in env vars!)
);

export async function POST(req) {
  try {
    const { userId, username, game, score, attempts } = await req.json();

    if (!userId || !username || !game) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("scores").insert([
      { userId, username, game, score, attempts },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving score:", err.message);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}
