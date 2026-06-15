export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    "Config": {
      "api.providers.AppStoreBackend.enabled": false,
      "api.providers.SteamBackend.enabled": false,
      "MaintenanceMode": false,
      "ShowMaintenanceMessage": false,
      "Matchmaking.Enabled": true
    },
    "Features": {
      "Rooms.CreationEnabled": true,
      "Logins.Enabled": true,
      "CustomRooms.Enabled": true,
      "CrossPlay.Enabled": true
    },
    "Status": "Normal"
  });
}
