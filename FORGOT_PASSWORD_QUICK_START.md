# Forgot Password Feature - Quick Reference

## 🎯 Quick Start (15 minutes)

### 1️⃣ Install Dependencies
```bash
cd server
npm install bcrypt dotenv
npm install
```

### 2️⃣ Create `.env` File
Create `server/.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here
```

### 3️⃣ Update Server Entry Point
Add this to top of `server/server.js`:
```javascript
require('dotenv').config();
```

### 4️⃣ Start Services
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Frontend
cd website
npm start
```

### 5️⃣ Test Flow
1. Go to: `http://localhost:3000/contractor-login`
2. Click "Forgot Password?"
3. Enter registered email
4. Check email for reset link
5. Click link and reset password

---

## 📋 API Endpoints

### Request Password Reset
```
POST /contractor/forgot-password
Content-Type: application/json

{
  "email": "contractor@example.com"
}
```

### Verify Reset Token
```
GET /contractor/verify-reset-token/:token
```

### Reset Password
```
POST /contractor/reset-password/:token
Content-Type: application/json

{
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

---

## 🗺️ Frontend Routes

| Route | Component | Status |
|-------|-----------|--------|
| `/contractor-forgot-password` | ContractorForgotPassword.jsx | ✅ Created |
| `/reset-password/:token` | ResetPassword.jsx | ✅ Created |
| `/contractor-login` | ContractorLogin.jsx | ✅ Updated (button added) |

---

## 🔐 Security Features

✅ **Bcrypt Hashing**: Passwords hashed with 10 rounds  
✅ **Secure Tokens**: 32-byte random tokens  
✅ **Token Hashing**: SHA-256 hashing before storage  
✅ **Time-Based Expiry**: Tokens expire after 15 minutes  
✅ **Email Privacy**: Same response for valid/invalid emails  
✅ **Password Validation**: Min 6 characters, confirmation matching  

---

## 📂 Modified Files

### Backend
- `server/package.json` - Added bcrypt
- `server/models/Contractor.js` - Added token fields
- `server/routes/contractorRoutes.js` - Added 3 new endpoints

### Frontend
- `website/src/App.jsx` - Added ResetPassword route
- `website/src/Pages/Dashboard/ContractorForgotPassword.jsx` - Redesigned
- `website/src/Pages/Dashboard/ResetPassword.jsx` - **NEW**

---

## 🧪 Test Cases

### ✅ Happy Path
1. Request reset → Email received → Click link → Reset password → Login success

### ✅ Edge Cases
- Expired token (wait 15+ minutes)
- Non-existent email (no error shown - security)
- Password mismatch (form validation)
- Invalid token in URL (error message)

---

## 🚑 Troubleshooting

**Email not sending?**
- Verify EMAIL_USER and EMAIL_PASS in .env
- Use app-specific password for Gmail (not regular password)
- Check spam folder

**Token invalid?**
- Tokens expire in 15 minutes
- Can't reuse same reset link
- Request new link

**Password won't update?**
- Check new password is 6+ characters
- Clear browser cache
- Check server logs

---

## 💻 Code Snippets

### Verify Token on Frontend
```javascript
const res = await fetch(
  `http://localhost:5000/contractor/verify-reset-token/${token}`
);
const data = await res.json();
if (data.valid) {
  // Show reset form
} else {
  // Show error
}
```

### Handle Reset
```javascript
const res = await fetch(
  `http://localhost:5000/contractor/reset-password/${token}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      newPassword,
      confirmPassword
    })
  }
);
```

---

## ⚙️ Configuration Options

### Gmail App Password
1. Enable 2FA: [myaccount.google.com/security](https://myaccount.google.com/security)
2. Generate: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use 16-char password in .env

### Email Expiry
Change in `server/routes/contractorRoutes.js` line ~25:
```javascript
contractor.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
```

### Password Strength
Minimum validation in `ResetPassword.jsx`:
```javascript
if (newPassword.length < 6) // Change 6 to higher number
```

---

## 📊 Feature Checklist

- [x] Forgot password page with email input
- [x] Backend forgot-password endpoint
- [x] Secure token generation
- [x] Email sending with reset link
- [x] Reset password page
- [x] Token validation
- [x] Password hashing with bcrypt
- [x] 15-minute expiry
- [x] Professional UI design
- [x] Error handling
- [x] Toast notifications
- [x] Security best practices

---

## 🔗 Related Files

- Full Setup Guide: `FORGOT_PASSWORD_SETUP.md`
- Login Component: `website/src/Pages/Login/ContractorLogin.jsx`
- Contractor Model: `server/models/Contractor.js`
- Auth Middleware: `server/middleware/authMiddleware.js`

---

**Ready to test? Start the server and frontend, then visit `/contractor-forgot-password`!** 🚀
