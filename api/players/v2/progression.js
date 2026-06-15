import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Extract the Player ID or Token sent by the game client header
  const playerId = req.headers['x-player-id'] || req.query.playerId;

  // Pull the updated Level and XP columns from your Supabase table
  const { data: player, error } = await supabase
    .from('players')
    .select('level, xp')
    .eq('player_id', playerId)
    .single();

  // Default values if testing locally or if the profile isn't fully synced yet
  const playerLevel = player ? player.level : 1;
  const playerXp = player ? player.xp : 0;

  return res.status(200).json({
    "Level": playerLevel,
    "XP": playerXp,
    "RequiredXP": 1000,
    "Tokens": 500, // Standard in-game currency balance
    "Prestige": 0
  });
}
