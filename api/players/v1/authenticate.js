import { createClient } from '@supabase/supabase-js';

// Vercel automatically reads these variables from your Supabase integration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { Username, Password } = req.body || {};

    // Query your Supabase database table for the matching player credentials
    const { data: player, error } = await supabase
      .from('players')
      .select('*')
      .eq('username', Username)
      .single();

    if (error || !player || player.password !== Password) {
      return res.status(400).json({ Error: "Invalid username or password." });
    }

    // Return a successful profile object that the July 2023 client recognizes
    return res.status(200).json({
      "Result": 1,
      "Token": "fake-revival-token-xyz",
      "PlayerId": player.player_id,
      "Username": player.username,
      "DisplayName": player.username
    });
  }

  return res.status(405).end();
}
