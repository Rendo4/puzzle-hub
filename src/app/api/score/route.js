import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Secure vars for backend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("❌ SUPABASE URL and SERVICE ROLE KEY are required");
}

// Create client with service role key (server-only)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req) {
  try {
    const { userId, username, game, score, attempts } = await req.json();

    if (!userId || !game) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("scores")
      .insert([{ user_id: userId, username, game, score, attempts }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
