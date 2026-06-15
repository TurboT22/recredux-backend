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
      "ShowMaintenanceMessage": false
    },
    "Features": {
      "Logins.Enabled": true,
      "Rooms.CreationEnabled": true
    },
    "Status": "Normal"
  });
}
