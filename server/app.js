require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { WebSocketServer } = require('ws');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/encryption_app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Audit Log Model
const auditLogSchema = new mongoose.Schema({
  clientId: String,
  action: String,
  timestamp: { type: Date, default: Date.now }
});
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// Key Store Model
const keyStoreSchema = new mongoose.Schema({
  clientId: { type: String, unique: true },
  publicKey: String
});
const KeyStore = mongoose.model('KeyStore', keyStoreSchema);

// WebSocket Server
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });
});

// API Routes
app.post('/api/keys', async (req, res) => {
  try {
    const { clientId, publicKey } = req.body;
    await KeyStore.findOneAndUpdate(
      { clientId },
      { publicKey },
      { upsert: true, new: true }
    );
    await AuditLog.create({ clientId, action: 'Key updated' });
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/logs', async (req, res) => {
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});