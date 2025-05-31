# 🔒 SecureCrypt - Military-Grade Encryption Playground

![Demo Screenshot](./assets/demo-screenshot.png)  
*Real-time encryption interface with AES-256 and RSA-2048*

## 🚀 Features
- **Client-Side Encryption**  
  - AES-256-GCM (Symmetric)  
  - RSA-OAEP 2048-bit (Asymmetric)  
- **Zero Data Transmission** - All crypto occurs in browser  
- **Audit Logging** - Optional server-side logging  
- **Responsive UI** - Works on mobile & desktop  

## 🛠️ Tech Stack
| Component       | Technology               |
|-----------------|--------------------------|
| Frontend        | React + Web Crypto API   |
| Backend         | Node.js/Express          |
| Security        | FIPS 140-2 compliant     |
| Styling         | CSS Modules + Glassmorphism |

## ⚙️ Installation
```bash
# Clone repository
git clone https://github.com/yourusername/securecrypt.git
cd securecrypt

# Install dependencies
cd client && npm install
cd ../server && npm install
```

## 🔐 Environment Setup
Create `.env` in `/server`:
```ini
MONGO_URI=mongodb://localhost:27017/securecrypt
JWT_SECRET=your_unguessable_secret_here
PORT=5000
```

## 🖥️ Usage
```bash
# Start backend
cd server && npm start

# Start frontend (in new terminal)
cd client && npm start
```
Access at: `http://localhost:3000`

## 📦 Project Structure
```
securecrypt/
├── client/               # React frontend
│   ├── src/              # Component source
│   └── public/           # Static assets
├── server/               # Node.js backend
│   ├── controllers/      # API logic
│   └── models/           # MongoDB schemas
├── assets/               # Screenshots/Docs
└── tests/                # Jest test cases
```

## 🛡️ Security Considerations
- **Never store** encryption keys in version control  
- Use HTTPS in production  
- Rotate JWT secrets periodically  
- Implement rate limiting (included in `server/middleware/rateLimit.js`)  

## 📜 License
MIT License - See [LICENSE](./LICENSE)

## 🤝 Contribution
1. Fork the project  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit changes (`git commit -m 'Add amazing feature'`)  
4. Push to branch (`git push origin feature/AmazingFeature`)  
5. Open Pull Request  

---

🔐 **Warning**: This project is for educational purposes. Consult a security professional before handling real sensitive data.
