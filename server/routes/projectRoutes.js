const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const ProjectRequest = require("../models/ProjectRequest");
const Proposal = require("../models/Proposal");
const Review = require("../models/Review");
const Contractor = require("../models/Contractor");
const Customer = require("../models/Customer");

const router = express.Router();

/**
 * GET /projects/:projectId/details
 * Get full project details with related data
 */
router.get("/:projectId/details", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await ProjectRequest.findById(projectId)
      .populate("customer", "name email phone profilePic");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get accepted proposal for this project
    const proposal = await Proposal.findOne({
      project: projectId,
      status: "accepted",
    }).populate("contractor", "name email phone profilePic specility");

    res.json({
      project,
      proposal,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CONTRACTOR → SUBMIT WORK
router.patch("/:projectId/submit", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const contractorId = req.user.id;

    const project = await ProjectRequest.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (project.status !== "in_progress") {
      return res.status(400).json({ error: "Project not in progress" });
    }

    const proposal = await Proposal.findOne({
      project: projectId,
      contractor: contractorId,
      status: "accepted",
    });

    if (!proposal) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    project.status = "submitted";
    project.submittedAt = new Date();

    await project.save();

    res.json({ message: "Work submitted", project });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /projects/:projectId/complete
 * Contractor marks project as completed
 */


/**
 * POST /projects/:projectId/close
 * Customer closes the project (after contractor completion)
 */


router.patch("/:projectId/close", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const customerId = req.user?.id;

    // 🔍 DEBUG: Log incoming request
    console.log("🔍 [CLOSE PROJECT] projectId:", projectId);
    console.log("🔍 [CLOSE PROJECT] customerId:", customerId);

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.error("❌ [CLOSE] Invalid ObjectId:", projectId);
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await ProjectRequest.findById(projectId);
    console.log("🔍 [CLOSE PROJECT] Found project:", project ? "YES" : "NO");

    if (!project) {
      console.error("❌ [CLOSE] Project not found:", projectId);
      return res.status(404).json({ error: "Project not found" });
    }

    // 🔐 Verify customer is project owner
    if (!project.customer) {
      console.error("❌ [CLOSE] Project has no customer assigned");
      return res.status(400).json({ error: "Project has no customer assigned" });
    }

    const projectCustomerId = project.customer.toString();
    const currentUserId = customerId ? customerId.toString() : null;
    
    console.log("🔍 [CLOSE] Checking ownership:");
    console.log("   - Project customer:", projectCustomerId);
    console.log("   - Current user:", currentUserId);

    if (projectCustomerId !== currentUserId) {
      console.error("❌ [CLOSE] Not authorized - not project owner");
      return res.status(403).json({ error: "Only project owner can close the project" });
    }

    // Validate project status
    console.log("🔍 [CLOSE] Current project status:", project.status);
    if (project.status !== "submitted") {
      console.error("❌ [CLOSE] Invalid status:", project.status);
      return res.status(400).json({ 
        error: `Project must be 'submitted' to close. Current status: ${project.status}` 
      });
    }

    // Update project
    project.status = "completed";
    project.completedAt = new Date();
    await project.save();

    console.log("✅ [CLOSE SUCCESS] Project closed:", projectId);
    console.log("   - New status:", project.status);
    console.log("   - Completed at:", project.completedAt);

    res.json({ 
      success: true,
      message: "Project closed successfully", 
      project 
    });

  } catch (err) {
    console.error("❌ [CLOSE ERROR] Exception caught:", err.message);
    console.error("   Stack:", err.stack);
    res.status(500).json({ 
      error: err.message,
      details: "Check server logs for full error trace"
    });
  }
});
/**
 * POST /projects/:projectId/review
 * Customer submits review for a completed project
 */
router.post("/:projectId/review", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { customerId, rating, comment, isPublic, ratedBy, raterName } = req.body;

    console.log("🔍 [REVIEW POST] Received request:");
    console.log("   - projectId:", projectId);
    console.log("   - customerId:", customerId);
    console.log("   - rating:", rating);
    console.log("   - ratedBy:", ratedBy);
    console.log("   - raterName:", raterName);

    // Validation
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.error("❌ [REVIEW] Invalid project ID:", projectId);
      return res.status(400).json({ error: "Invalid project ID" });
    }

    if (!rating || rating < 1 || rating > 5) {
      console.error("❌ [REVIEW] Invalid rating:", rating);
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    if (!comment || comment.length < 10) {
      console.error("❌ [REVIEW] Comment too short");
      return res
        .status(400)
        .json({ error: "Comment must be at least 10 characters" });
    }

    // Get project and verify it's completed
    const project = await ProjectRequest.findById(projectId);
    if (!project) {
      console.error("❌ [REVIEW] Project not found:", projectId);
      return res.status(404).json({ error: "Project not found" });
    }

    console.log("🔍 [REVIEW] Project status:", project.status);
    if (project.status !== "completed") {
      console.error("❌ [REVIEW] Project not completed:", project.status);
      return res
        .status(400)
        .json({
          error: "Review can only be submitted for completed projects",
        });
    }

    // Verify customer owns this project
    if (project.customer.toString() !== customerId) {
      console.error("❌ [REVIEW] Not project owner");
      return res.status(403).json({
        error: "Only the project owner can review",
      });
    }

    // Get accepted proposal to find contractor
    const proposal = await Proposal.findOne({
      project: projectId,
      status: "accepted",
    });

    if (!proposal) {
      console.error("❌ [REVIEW] Proposal not found:", projectId);
      return res.status(404).json({ error: "Completed proposal not found" });
    }

    console.log("🔍 [REVIEW] Contractor ID:", proposal.contractor);

    // Check if review already exists
    const existingReview = await Review.findOne({
      project: projectId,
      customer: customerId,
    });

    if (existingReview) {
      console.warn("⚠️  [REVIEW] Review already exists for this project");
      return res
        .status(400)
        .json({ error: "You have already submitted a review for this project" });
    }

    // Create review with all required fields
    console.log("🔍 [REVIEW] Creating review with data:");
    console.log("   - ratedBy:", ratedBy || "customer");
    console.log("   - raterName:", raterName || "Customer");

    const review = new Review({
      project: projectId,
      contractor: proposal.contractor,
      customer: customerId,
      proposal: proposal._id,
      rating,
      comment,
      isPublic: isPublic !== false, // default to true
      ratedBy: ratedBy || "customer",
      raterName: raterName || "Customer",
    });

    console.log("🔍 [REVIEW] Review object created:", {
      project: review.project,
      contractor: review.contractor,
      customer: review.customer,
      rating: review.rating,
      ratedBy: review.ratedBy,
      raterName: review.raterName,
    });

    await review.save();
    console.log("✅ [REVIEW] Review saved successfully:", review._id);

    // Update contractor's rating statistics
    const allReviews = await Review.find({
      contractor: proposal.contractor,
      isPublic: true,
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    const totalCompleted = await Proposal.countDocuments({
      contractor: proposal.contractor,
      status: "accepted",
    });

    console.log("🔍 [REVIEW] Updating contractor rating:");
    console.log("   - Average rating:", avgRating);
    console.log("   - Total completed:", totalCompleted);

    await Contractor.findByIdAndUpdate(proposal.contractor, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      totalProjects: totalCompleted,
    });

    console.log("✅ [REVIEW] Contractor rating updated");

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (err) {
    console.error("❌ [REVIEW] Exception caught:", err.message);
    console.error("   Stack:", err.stack);
    res.status(500).json({ error: err.message, details: "Check server logs for full trace" });
  }
});

/**
 * GET /projects/:projectId/review-status
 * Check if customer can submit review
 */
router.get("/:projectId/review-status", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { customerId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await ProjectRequest.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const review = await Review.findOne({
      project: projectId,
      customer: customerId,
    });

    res.json({
      projectStatus: project.status,
      canReview: project.status === "completed" && !review,
      reviewSubmitted: !!review,
      review: review || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
