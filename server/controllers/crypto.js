const { webcrypto } = require('crypto');
const express = require('express');
const router = express.Router();

// Generate keys for demo (in prod, store securely)
const keys = new Map();

router.post('/setup', async (req, res) => {
  const { clientId } = req.body;
  
  // Generate AES key
  const aesKey = await webcrypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // Generate RSA key pair
  const rsaKeys = await webcrypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );

  keys.set(clientId, { aesKey, rsaKeys });
  res.json({ status: 'Keys generated' });
});

router.post('/encrypt', async (req, res) => {
  const { clientId, text, algorithm } = req.body;
  const clientKeys = keys.get(clientId);

  try {
    let result;
    if (algorithm === 'AES') {
      const iv = webcrypto.getRandomValues(new Uint8Array(12));
      const encrypted = await webcrypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        clientKeys.aesKey,
        new TextEncoder().encode(text)
      );
      result = { iv: Array.from(iv), ciphertext: Array.from(new Uint8Array(encrypted)) };
    } else {
      const encrypted = await webcrypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        clientKeys.rsaKeys.publicKey,
        new TextEncoder().encode(text)
      );
      result = { ciphertext: Array.from(new Uint8Array(encrypted)) };
    }
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Encryption failed' });
  }
});

module.exports = router;