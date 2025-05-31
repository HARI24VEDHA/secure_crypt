const AuditLog = require('../models/AuditLog');

module.exports = async (req, res, next) => {
  try {
    await AuditLog.create({
      clientId: req.user?.clientId || 'anonymous',
      action: `${req.method} ${req.path}`,
      metadata: {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
    next();
  } catch (err) {
    console.error('Audit log failed:', err);
    next();
  }
};