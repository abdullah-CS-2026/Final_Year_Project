// routes/contractorRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/authMiddleware");
const { JWT_SECRET } = require("../utils/jwtConfig");
const Customer = require("../models/Customer");
const Contractor = require("../models/Contractor");
const Proposal = require("../models/Proposal")
const ProjectRequest = require("../models/ProjectRequest");



const router = express.Router();
// Admin signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ check if an admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create JWT token
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET all pending contractors
router.get("/contractors/pending", async (req, res) => {
  try {
    const pendingContractors = await Contractor.find({ status: "pending" });

    res.json({
      message: "Pending contractors fetched successfully",
      list: pendingContractors,
    });
  } catch (err) {
    console.error("Error fetching pending contractors:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ APPROVE contractor
router.put("/contractors/:id/approve", async (req, res) => {
  try {
    const contractorId = req.params.id;
    const updated = await Contractor.findByIdAndUpdate(
      contractorId,
      { status: "approved" },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Contractor not found" });
    }
    res.json({ message: "Contractor approved successfully", contractor: updated });
  } catch (err) {
    console.error("Error approving contractor:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ REJECT contractor
router.put("/contractors/:id/reject", async (req, res) => {
  try {
    const contractorId = req.params.id;
    const updated = await Contractor.findByIdAndUpdate(
      contractorId,
      { status: "rejected" },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Contractor not found" });
    }
    res.json({ message: "Contractor rejected successfully", contractor: updated });
  } catch (err) {
    console.error("Error rejecting contractor:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all running (accepted) bids for admin
router.get("/running-bids", async (req, res) => {
  try {
    const proposals = await Proposal.find({ status: "accepted" })
      .populate("customer", "name email phone")
      .populate("contractor", "name email phone cnicNumber")
      .populate("project", "title location budget");

    res.json({ list: proposals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ADMIN DASHBOARD STATS
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalContractors = await Contractor.countDocuments();
    const totalCustomers = await Customer.countDocuments();

    const pendingContractors = await Contractor.countDocuments({
      status: "pending",
    });

    const runningBids = await Proposal.countDocuments({
      status: { $in: ["pending", "shortlisted"] },
    });

    const successfulBids = await Proposal.countDocuments({
      status: "accepted",
    });

    const rejectedProposals = await Proposal.countDocuments({
      status: "rejected",
    });

    const totalProjects = await ProjectRequest.countDocuments();

    const openProjects = await ProjectRequest.countDocuments({
      status: "open",
    });

    const closedProjects = await ProjectRequest.countDocuments({
      status: "closed",
    });

    res.json({
      totalContractors,
      totalCustomers,
      pendingContractors,
      runningBids,
      successfulBids,
      rejectedProposals,
      totalProjects,
      openProjects,
      closedProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});







module.exports = router;
