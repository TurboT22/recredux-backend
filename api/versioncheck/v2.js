export default async function handler(req, res) {
  // Tell the game client it is safe to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // This tells the 2023 Rec Room client that your server is online
  return res.status(200).json({
    "ValidVersion": true,
    "ServerStatus": "Normal",
    "Message": "Welcome to your Cloud Revival!",
    "MaintenanceMode": false
  });
}
