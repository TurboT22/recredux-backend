export default async function handler(req, res) {
  // Global cross-origin headers to allow your game to communicate cleanly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-player-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const urlPath = req.url;

  // 1. Intercept the July 2023 version check
  if (urlPath.includes('/api/versioncheck/v3') || urlPath.includes('/api/versioncheck/v2')) {
    return res.status(200).json({
      "ValidVersion": true,
      "UpdateBehavior": 0,
      "Message": "Welcome to your Cloud Backend!"
    });
  }

  // 2. Intercept the July 2023 core configuration
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

  // Fallback catch-all to prevent the game engine from freezing on secondary lookups
  return res.status(200).json({ "Status": "Normal", "Message": "Backend active" });
}
