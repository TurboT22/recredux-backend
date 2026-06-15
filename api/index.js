import { createClient } from '@supabase/supabase-js';

// Fully handles Vercel's automated integration keys to prevent 500 crashes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // Global cross-origin headers to allow your game to communicate cleanly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-player-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const urlPath = req.url;

  // 1. ENDPOINT: Version Check Bypass
  if (urlPath.includes('/api/versioncheck/v3') || urlPath.includes('/api/versioncheck/v2')) {
    return res.status(200).json({
      "ValidVersion": true,
      "UpdateBehavior": 0,
      "Message": "Welcome to your Cloud Backend!"
    });
  }

  // 2. ENDPOINT: Core Configuration Flags
  if (urlPath.includes('/api/config/v2')) {
    return res.status(200).json({
      "Config": {
        "api.providers.AppStoreBackend.enabled": false,
        "api.providers.SteamBackend.enabled": false,
        "MaintenanceMode": false,
        "ShowMaintenanceMessage": false
      },
      "Features": {
        "Logins.Enabled": true,
        "Rooms.CreationEnabled": true,
        "Accounts.RegistrationEnabled": true
      },
      "Status": "Normal"
    });
  }

  // 3. ENDPOINT: Player Account Authentication (Login)
  if (urlPath.includes('/api/players/v1/authenticate')) {
    if (req.method === 'POST') {
      const { Username, Password } = req.body || {};

      // Look inside your Supabase spreadsheet for a matching username
      const { data: player, error } = await supabase
        .from('players')
        .select('*')
        .eq('username', Username)
        .single();

      if (error || !player || player.password !== Password) {
        return res.status(400).json({ "Result": 0, "Message": "Invalid username or password." });
      }

      return res.status(200).json({
        "Result": 1,
        "Token": "redux-session-token-secure",
        "PlayerId": player.player_id,
        "Username": player.username,
        "DisplayName": player.username
      });
    }
  }

  // 4. ENDPOINT: Account Creation (Registration)
  if (urlPath.includes('/api/players/v1/create')) {
    if (req.method === 'POST') {
      const { Username, Password } = req.body || {};
      if (!Username || !Password) return res.status(400).json({ "Result": 0 });

      // Verify the username isn't already taken
      const { data: userExists } = await supabase
        .from('players')
        .select('username')
        .eq('username', Username)
        .single();

      if (userExists) return res.status(400).json({ "Result": 0, "Message": "Username taken." });

      // Create a random, unique Rec Room player numeric ID number
      const newPlayerId = Math.floor(1000000 + Math.random() * 9000000);

      // Save the new player directly onto your Supabase table grid
      const { error } = await supabase
        .from('players')
        .insert([{ username: Username, password: Password, player_id: newPlayerId, level: 1, xp: 0 }]);

      if (error) return res.status(500).json({ "Result": 0 });

      return res.status(200).json({
        "Result": 1,
        "Token": "redux-session-token-secure",
        "PlayerId": newPlayerId,
        "Username": Username,
        "DisplayName": Username
      });
    }
  }

  // 5. ENDPOINT: Player Level & Progression Data
  if (urlPath.includes('/api/players/v2/progression')) {
    const playerId = req.headers['x-player-id'] || req.query.playerId;

    const { data: player } = await supabase
      .from('players')
      .select('level, xp')
      .eq('player_id', playerId)
      .single();

    return res.status(200).json({
      "Level": player ? player.level : 1,
      "XP": player ? player.xp : 0,
      "RequiredXP": 1000,
      "Tokens": 1000,
      "Prestige": 0
    });
  }

  // Universal fallback catch-all to prevent server stalls
  return res.status(200).json({ "Status": "Normal", "Message": "Cloud server operational." });
}
