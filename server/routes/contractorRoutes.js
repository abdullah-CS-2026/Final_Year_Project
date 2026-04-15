// routes/contractorRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Contractor = require("../models/Contractor");
const fileUpload = require("../ContractorPic");

const certificationUpload = require("../middleware/ContractorCertifications");
const verificationUpload = require("../middleware/ContractorVerification");
const verificationImageUpload = require("../middleware/ContractorVerificationImage");
const cnicUpload = require("../middleware/ContractorCNIC");
const authMiddleware = require("../middleware/authMiddleware");
const { JWT_SECRET } = require("../utils/jwtConfig");
const ProjectRequest = require("../models/ProjectRequest");
const Proposal = require("../models/Proposal")



const router = express.Router();

// Contractor signup
router.post("/signup", fileUpload, async (req, res) => {
  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const contractorData = {
      name: req.body.name,
      phone: req.body.phone,
      cnicNumber: req.body.cnicNumber,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      password: hashedPassword, // Use hashed password
      gender: req.body.gender,
      profilePic: req.file ? `/contractor_images/${req.file.filename}` : null,
      status: "pending",
    };

    const contractor = new Contractor(contractorData);
    await contractor.save();

    res.status(201).json({ message: "Signup successful! Wait for admin approval.", contractor });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.cnicNumber) return res.status(400).json({ error: "CNIC already registered" });
      if (error.keyPattern.phone) return res.status(400).json({ error: "Phone already registered" });
      if (error.keyPattern.email) return res.status(400).json({ error: "Email already registered" });
    }
    res.status(400).json({ error: error.message });
  }
});

// Contractor verification image upload (separate route for verification image)
router.post("/signup/verification", verificationImageUpload, async (req, res) => {
  try {
    const { contractorId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Verification image is required" });
    }

    const contractor = await Contractor.findByIdAndUpdate(
      contractorId,
      { verificationImage: `/contractor_verification_images/${req.file.filename}` },
      { new: true }
    );

    if (!contractor) {
      return res.status(404).json({ error: "Contractor not found" });
    }

    res.status(200).json({
      message: "Verification image uploaded successfully",
      contractor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Contractor CNIC images upload (separate route for CNIC images)
router.post("/signup/cnic", cnicUpload, async (req, res) => {
  try {
    const { contractorId } = req.body;

    if (!req.files || (!req.files.cnicFront && !req.files.cnicBack)) {
      return res.status(400).json({ error: "At least one CNIC image is required" });
    }

    const updateData = {};

    if (req.files.cnicFront) {
      updateData.cnicFront = `/contractor_cnic_images/${req.files.cnicFront[0].filename}`;
    }

    if (req.files.cnicBack) {
      updateData.cnicBack = `/contractor_cnic_images/${req.files.cnicBack[0].filename}`;
    }

    const contractor = await Contractor.findByIdAndUpdate(
      contractorId,
      updateData,
      { new: true }
    );

    if (!contractor) {
      return res.status(404).json({ error: "Contractor not found" });
    }

    res.status(200).json({
      message: "CNIC images uploaded successfully",
      contractor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Contractor login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Contractor.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "pending") {
      return res.status(403).json({ message: "Account pending approval by admin." });
    }
    if (user.status === "rejected") {
      return res.status(403).json({ message: "Your account was rejected by admin." });
    }

    const token = jwt.sign({ id: user._id, email: user.email, profilePic: user.profilePic }, JWT_SECRET, { expiresIn: "24h" });

    const contractor = await Contractor.findById(user._id).select("-password");

    res.json({
      message: "Login successful",
      token,
      contractor
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// FORGOT PASSWORD - SEND RESET LINK
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find contractor by email only (not by name)
    const contractor = await Contractor.findOne({ email });

    // For security: don't reveal whether email exists or not
    if (!contractor) {
      return res.status(200).json({ 
        message: "If an account exists with this email, you will receive a password reset link shortly." 
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Set token expiry to 15 minutes
    contractor.resetPasswordToken = resetTokenHash;
    contractor.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await contractor.save();

    // SEND EMAIL WITH RESET LINK
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { 
        user: process.env.EMAIL_USER || "your-email@gmail.com", 
        pass: process.env.EMAIL_PASS || "your-app-password" 
      }
    });

    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #ff6b6b; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          <a href="${resetLink}" style="display: inline-block; background-color: #ff6b6b; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-bottom: 20px;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
            Or copy and paste this link in your browser:
          </p>
          <p style="color: #ff6b6b; font-size: 12px; word-break: break-all;">
            ${resetLink}
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            This link will expire in 15 minutes. If you didn't request a password reset, please ignore this email.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Smart Build" <${process.env.EMAIL_USER || "your-email@gmail.com"}>`,
      to: email,
      subject: "Password Reset Request - Smart Build Contractor",
      html: htmlEmail
    });

    res.status(200).json({ 
      message: "If an account exists with this email, you will receive a password reset link shortly."
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
});

// RESET PASSWORD - VERIFY TOKEN AND UPDATE PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    // Validate password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find contractor with valid token that hasn't expired
    const contractor = await Contractor.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!contractor) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    // Hash new password with bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update contractor password and clear reset fields
    contractor.password = hashedPassword;
    contractor.resetPasswordToken = undefined;
    contractor.resetPasswordExpires = undefined;
    await contractor.save();

    res.status(200).json({ 
      message: "Password reset successful. You can now login with your new password." 
    });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
});

// VERIFY RESET TOKEN (to validate link when user clicks)
router.get("/verify-reset-token/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const contractor = await Contractor.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!contractor) {
      return res.status(400).json({ valid: false, message: "Invalid or expired reset link" });
    }

    res.status(200).json({ valid: true, message: "Token is valid" });

  } catch (err) {
    res.status(500).json({ valid: false, message: "An error occurred" });
  }
});

// OLD OTP ENDPOINTS (keeping for backward compatibility temporarily)
// SEND OTP
router.post("/forgot-password-otp", async (req, res) => {
  try {
    const { email, name } = req.body;

    const contractor = await Contractor.findOne({ email, name });

    if (!contractor) {
      return res.status(404).json({ msg: "No user found with this Email & Name" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    contractor.resetOTP = otp;
    contractor.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await contractor.save();

    // SEND EMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER || "yourEmail@gmail.com", pass: process.env.EMAIL_PASS || "your-app-password" }
    });

    await transporter.sendMail({
      from: "Contractor App",
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const contractor = await Contractor.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!contractor) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    res.json({ msg: "OTP verified successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// RESET PASSWORD VIA OTP (old method, for backend compatibility)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const contractor = await Contractor.findOne({ email });

    if (!contractor) {
      return res.status(404).json({ msg: "Contractor not found" });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    contractor.password = hashedPassword;
    contractor.resetOTP = undefined;
    contractor.resetOTPExpires = undefined;
    await contractor.save();

    res.json({ msg: "Password reset successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// Update contractor profile
router.put("/update/:id", fileUpload, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      gender: req.body.gender,
      experience: req.body.experience,
      specialties: req.body.specialties ? JSON.parse(req.body.specialties) : undefined,
    };

    // ✅ Remove profile pic
    if (req.body.removeProfile === "true" || req.body.removeProfile === true) {
      updatedData.profilePic = null;
    }

    // ✅ If new profile picture uploaded
    if (req.file) {
      updatedData.profilePic = `/contractor_images/${req.file.filename}`;
    }

    // ✅ Find & update contractor
    const updatedContractor = await Contractor.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    )
      .select("-password") // hide password
      .lean(); // convert mongoose doc to plain JS

    if (!updatedContractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    // ✅ include all additional stored fields
    const completeContractor = await Contractor.findById(id).select("-password");

    res.json({
      message: "Profile updated successfully ✅",
      contractor: completeContractor,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Contractor profile (protected)
router.get("/me", authMiddleware, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});



// GET all open projects only from contractor's city
router.get("/projects/:contractorId", async (req, res) => {
  try {
    const { contractorId } = req.params;

    console.log("🔍 [GET PROJECTS] Fetching for contractor:", contractorId);

    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
      console.error("❌ [GET PROJECTS] Contractor not found:", contractorId);
      return res.status(404).json({ error: "Contractor not found" });
    }

    console.log("🔍 [GET PROJECTS] Contractor city:", contractor.city);

    const cityRegex = new RegExp(contractor.city, "i");

    // Query for projects that are available (pending, accepted status)
    // NOT: in_progress, submitted, completed, closed
    const projects = await ProjectRequest.find({
      status: { $in: ["pending", "accepted"] },
      location: cityRegex
    }).populate("customer", "name email phone profilePic");

    console.log("✅ [GET PROJECTS] Found projects:", projects.length);
    projects.forEach((p, idx) => {
      console.log(`   ${idx + 1}. ${p.title} - Status: ${p.status}`);
    });

    res.json(projects);
  } catch (error) {
    console.error("❌ [GET PROJECTS] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});




// Contractor expresses interest
router.post("/projects/:id/contact", async (req, res) => {
  try {
    const { contractorId } = req.body;
    const projectId = req.params.id;

    // Save contractor interest (later you can extend with proposals)
    res.json({ message: `Contractor ${contractorId} contacted customer for project ${projectId}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// Show All Contractors (exclude pending)
router.get('/list', async (req, res) => {
  try {
    // fetch contractors whose status is not "pending"
    const list = await Contractor.find({ status: { $ne: "pending" } });

    if (!list || list.length === 0) {
      return res.status(404).json({ message: "No contractors found", list: [] });
    }

    res.status(200).json({ message: "Success", list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", list: [] });
  }
});


// Get all pending contractors
router.get("/pending", async (req, res) => {
  try {
    const pending = await Contractor.find({ status: "pending" });
    if (!pending || pending.length === 0) {
      return res.status(404).json({ message: "No pending contractors found", list: [] });
    }
    res.status(200).json({ message: "Success", list: pending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", list: [] });
  }
});


router.get("/:contractorId/accepted", async (req, res) => {
  try {
    const { contractorId } = req.params;
    const proposals = await Proposal.find({ contractor: contractorId, status: "accepted" })
      .populate("customer", "name email phone profilePic")
      .populate("project", "title budget location");

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get contractor by ID
router.get("/:id", async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id).select("-password");

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }
    res.json(contractor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;
