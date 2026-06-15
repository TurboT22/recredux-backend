import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // Force Vercel to output clear permissions so the Unity client doesn't block the handshake
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-player-id');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const urlPath = req.url;

  // 1. Version Check Bypass
  if (urlPath.includes('/api/versioncheck/v3') || urlPath.includes('/api/versioncheck/v2')) {
    return res.status(200).json({
      "ValidVersion": true,
      "UpdateBehavior": 0,
      "Message": "Welcome to your Cloud Backend!"
    });
  }

  // 2. Core Server Parameter Config
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

  // 3. Player Account Authentication
  if (urlPath.includes('/api/players/v1/authenticate')) {
    if (req.method === 'POST') {
      const { Username, Password } = req.body || {};
      const { data: player, error } = await supabase
        .from('players')
        .select('*')
        .eq('username', Username)
        .single();

      if (error || !player || player.password !== Password) {
        return res.status(400).json({ "Result": 0, "Message": "Invalid credentials." });
      }

      return res.status(200).json({
        "Result": 1,
        "Token": "secure-redux-token",
        "PlayerId": player.player_id,
        "Username": player.username,
        "DisplayName": player.username
      });
    }
  }

  // Universal catch-all status fallback
  return res.status(200).json({ "Status": "Normal", "Message": "Server Active" });
}
