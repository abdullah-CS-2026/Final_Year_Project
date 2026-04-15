# 🔴 401 Unauthorized Error - Diagnostics & Fix Guide

## What is 401 Unauthorized?
Your request is reaching the backend, but the **JWT token is invalid or missing**.

---

## ✅ Quick Diagnosis Checklist

### Step 1: Check if Token Exists
Open browser DevTools → Console and run:
```javascript
console.log("Token:", localStorage.getItem("token"));
console.log("CustomerToken:", localStorage.getItem("customerToken"));
console.log("ContractorToken:", localStorage.getItem("contractorToken"));
```

**If all show `null`:**
- ❌ You're not logged in
- ✅ **FIX:** Log in again

**If token shows a long string:**
- ✅ Token exists, move to Step 2

---

### Step 2: Check Token Format
Your token should look like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDlmZjMwN2Zkc2Zz...
```
(Three parts separated by dots)

**If token is short or malformed:**
- ❌ Token is corrupted
- ✅ **FIX:** Log in again

---

### Step 3: Verify Backend JWT_SECRET

The **401 error is usually because JWT_SECRET doesn't match**.

**File:** `server/utils/jwtConfig.js`

```javascript
// Check what's currently set
console.log(process.env.JWT_SECRET);
```

**Make sure both files use SAME SECRET:**

1. **When creating token (login route):**
   ```javascript
   const token = jwt.sign({ id: user._id }, JWT_SECRET);
   ```

2. **When verifying token (authMiddleware.js):**
   ```javascript
   const decoded = jwt.verify(token, JWT_SECRET);
   ```

If these use different secrets → **401 error**

---

## 🔧 Correct Implementation

### Frontend (ProjectClosing.jsx) - ✅ FIXED
```javascript
const fetchProjectDetails = async () => {
  try {
    // Try multiple storage keys
    const token = 
      localStorage.getItem("token") ||
      localStorage.getItem("customerToken") ||
      localStorage.getItem("contractorToken");

    if (!token) {
      console.error("No token found");
      return;
    }

    // Verify token format
    if (token.split('.').length !== 3) {
      console.error("Token format invalid");
      return;
    }

    const response = await axios.get(
      `http://localhost:5000/projects/${projectId}/details`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,  // ✅ IMPORTANT: "Bearer " prefix
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Request successful");
  } catch (err) {
    if (err.response?.status === 401) {
      console.error("❌ 401 Unauthorized");
      console.error("Token:", localStorage.getItem("token")?.substring(0, 20));
      console.error("Try logging in again");
    }
  }
};
```

### Backend (authMiddleware.js) - Verify format
```javascript
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    console.error("❌ No Authorization header");
    return res.status(401).json({ authenticated: false });
  }

  // Should be "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.error("❌ Invalid header format:", authHeader);
    return res.status(401).json({ authenticated: false });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ authenticated: false });
  }
};
```

---

## 🛠️ Common Causes & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Token Missing** | `localStorage.getItem("token")` = `null` | Log in again |
| **Token Expired** | Token exists but very old | Log in again |
| **Wrong Storage Key** | Token stored under different name | Check login code for key used |
| **Missing Bearer Prefix** | Header sent as `Authorization: token123` | Must be `Authorization: Bearer token123` |
| **JWT_SECRET Mismatch** | Different secret in login vs middleware | Use same `JWT_SECRET` everywhere |
| **Token Corrupted** | Token doesn't have 3 dot-separated parts | Log in again |
| **Server Restarted** | Token was valid before, now 401 | Restart server, log in again |

---

## 🚀 How to Debug Live

### Add logging to middleware
**server/middleware/authMiddleware.js:**
```javascript
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("📩 Received header:", authHeader?.substring(0, 30));
  
  if (!authHeader) return res.status(401).json({ authenticated: false });

  const token = authHeader.split(" ")[1];
  console.log("🔍 Token:", token?.substring(0, 30));
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token valid for user:", decoded.id);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT Error:", err.message);
    console.error("⚠️ Is JWT_SECRET correct?");
    return res.status(401).json({ authenticated: false });
  }
};
```

### Check what frontend sends
**Browser Console:**
```javascript
// See what frontend is sending
fetch('http://localhost:5000/projects/test/details', {
  headers: {
    "Authorization": "Bearer " + localStorage.getItem("token")
  }
}).then(r => {
  console.log("Status:", r.status);
  return r.json();
}).catch(err => console.error(err));
```

---

## ✅ Complete Fix Checklist

- [ ] Token exists in localStorage: `console.log(localStorage.getItem("token"))`
- [ ] Token has 3 dot-separated parts
- [ ] Frontend sends: `Authorization: Bearer <token>`
- [ ] Backend receives Authorization header
- [ ] JWT_SECRET is same in login and middleware
- [ ] Backend can verify token without error
- [ ] User logged in recently (token not expired)
- [ ] Backend server running on port 5000: `npm start`

---

## 📞 If Still Getting 401

1. **Check browser console for error messages** - They'll tell you what's wrong
2. **Check server console while making request** - Logs will show exactly where it fails
3. **Try logging in again** - Fresh token often resolves it
4. **Check JWT_SECRET matches** - Most common cause
5. **Verify token sending with Bearer prefix** - We've already fixed this in ProjectClosing.jsx

---

**Status:** ✅ **ProjectClosing.jsx fixed**  
Next: Test by logging in and clicking "Close Project"
