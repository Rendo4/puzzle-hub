import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(req) {
  const { userId, username, game, score, attempts } = await req.json();

  // Ensure user exists
  await supabase.from("users").upsert(
    { id: userId, username },
    { onConflict: "id" }
  );

  // Insert score
  const { data, error } = await supabase.from("scores").insert([
    { user_id: userId, game, score, attempts },
  ]);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ success: true, data }), { status: 200 });
}