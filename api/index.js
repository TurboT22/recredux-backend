export default async function handler(req, res) {
  // Global access configurations so the game engine can read your data
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-player-id');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Read the exact subfolder path the July 2023 game client is asking for
  const urlPath = req.url;

  // 1. Intercept the Version Check Endpoint
  if (urlPath.includes('/api/versioncheck/v3') || urlPath.includes('/api/versioncheck/v2')) {
    return res.status(200).json({
      "ValidVersion": true,
      "UpdateBehavior": 0,
      "Message": "Welcome to your Cloud Backend!"
    });
  }

  // 2. Intercept the Main Server Config Endpoint
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

  // Fallback catch-all to prevent the game engine from freezing if it queries a different path
  return res.status(200).json({ "Status": "Normal", "Message": "Catch-all proxy route active." });
}
