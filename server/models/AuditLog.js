const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: String,
  user: String,
  ip: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);