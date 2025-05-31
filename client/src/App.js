import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State management
  const [text, setText] = useState('');
  const [aesEncrypted, setAesEncrypted] = useState('');
  const [rsaEncrypted, setRsaEncrypted] = useState('');
  const [cryptoKeys, setCryptoKeys] = useState({
    aesKey: null,
    rsaKeys: null
  });

  // Initialize crypto keys on component mount
  useEffect(() => {
    const initKeys = async () => {
      try {
        const aesKey = await crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );

        const rsaKeys = await crypto.subtle.generateKey(
          {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
          },
          true,
          ["encrypt", "decrypt"]
        );

        setCryptoKeys({ aesKey, rsaKeys });
      } catch (err) {
        console.error("Key generation failed:", err);
      }
    };

    initKeys();
  }, []);

  const handleEncrypt = async (inputText) => {
    if (!inputText || !cryptoKeys.aesKey || !cryptoKeys.rsaKeys) return;

    try {
      // AES-256 Encryption
      const aesIv = crypto.getRandomValues(new Uint8Array(12));
      const aesCipher = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: aesIv },
        cryptoKeys.aesKey,
        new TextEncoder().encode(inputText)
      );
      setAesEncrypted(`AES:${arrayToHex(aesIv)}:${arrayToHex(new Uint8Array(aesCipher))}`);

      // RSA-OAEP Encryption
      const rsaCipher = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        cryptoKeys.rsaKeys.publicKey,
        new TextEncoder().encode(inputText)
      );
      setRsaEncrypted(`RSA:${arrayToHex(new Uint8Array(rsaCipher))}`);
    } catch (err) {
      console.error("Encryption error:", err);
    }
  };

  const arrayToHex = (buffer) => {
    return [...buffer].map(b => b.toString(16).padStart(2, '0')).join('');
  };

  return (
    <div className="App">
      <h1>Military-Grade Encryption Playground</h1>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          handleEncrypt(e.target.value);
        }}
        placeholder="Type sensitive data here..."
        rows={5}
      />
      
      <div className="result-box">
        <h3>AES-256 (Symmetric):</h3>
        <p className="ciphertext">{aesEncrypted || '--'}</p>
        
        <h3>RSA-OAEP (Asymmetric):</h3>
        <p className="ciphertext">{rsaEncrypted || '--'}</p>
      </div>
    </div>
  );
}

export default App;


