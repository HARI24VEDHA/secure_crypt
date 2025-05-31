const { writeFileSync, readFileSync } = require('fs');
const { subtle } = require('crypto');

class KeyService {
  constructor(clientId) {
    this.clientId = clientId;
    this.keyPath = `./keys/${clientId}.json`;
  }

  async loadOrCreateKeys() {
    try {
      const keys = JSON.parse(readFileSync(this.keyPath));
      return {
        aesKey: await subtle.importKey('jwk', keys.aesKey, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']),
        rsaKeys: {
          publicKey: await subtle.importKey('jwk', keys.rsaPublicKey, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']),
          privateKey: await subtle.importKey('jwk', keys.rsaPrivateKey, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt'])
        }
      };
    } catch (err) {
      return this.generateNewKeys();
    }
  }
}