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
 * GET /workflow/projects/:projectId/details
 * Get complete project details with workflow status
 */
router.get("/projects/:projectId/details", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await ProjectRequest.findById(projectId)
      .populate("customer", "name email phone profilePic")
      .populate("acceptedProposal");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get accepted proposal details
    const acceptedProposal = await Proposal.findOne({
      project: projectId,
      status: "accepted",
    }).populate("contractor", "name email phone profilePic rating totalProjects");

    // Determine user role
    const customer = await Customer.findById(userId);
    const contractor = await Contractor.findById(userId);

    const userRole = customer ? "customer" : contractor ? "contractor" : "guest";
    const isProjectOwner = project.customer.toString() === userId;
    const isAcceptedContractor = acceptedProposal?.contractor._id.toString() === userId;

    res.json({
      project,
      acceptedProposal,
      userRole,
      permissions: {
        canSubmit: userRole === "contractor" && isAcceptedContractor && project.status === "in_progress",
        canClose: userRole === "customer" && isProjectOwner && project.status === "submitted",
        canRate: (userRole === "contractor" && isAcceptedContractor && project.status === "completed" && !project.contractorRated) ||
                 (userRole === "customer" && isProjectOwner && project.status === "completed" && !project.customerRated),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching project details:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /workflow/projects/:projectId/submit
 * Contractor marks project work as submitted (in_progress → submitted)
 */
router.patch("/projects/:projectId/submit", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const contractorId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Get project
    const project = await ProjectRequest.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Verify contractor has accepted proposal
    const proposal = await Proposal.findOne({
      project: projectId,
      contractor: contractorId,
      status: "accepted",
    });

    if (!proposal) {
      return res.status(403).json({
        error: "You don't have an accepted proposal for this project",
      });
    }

    // Validate current status
    if (project.status !== "in_progress") {
      return res.status(400).json({
        error: `Cannot submit. Project status must be 'in_progress', current status is '${project.status}'`,
      });
    }

    // Update project status
    project.status = "submitted";
    project.submittedAt = new Date();
    await project.save();

    console.log(`✅ Project ${projectId} submitted by contractor ${contractorId}`);

    res.json({
      success: true,
      message: "Work submitted successfully. Waiting for customer approval.",
      project,
      status: "submitted",
    });
  } catch (err) {
    console.error("❌ Error submitting project:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /workflow/projects/:projectId/close
 * Customer marks project as completed (submitted → completed)
 */
router.patch("/projects/:projectId/close", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const customerId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Get project
    const project = await ProjectRequest.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Verify customer is project owner
    if (project.customer.toString() !== customerId.toString()) {
      return res.status(403).json({
        error: "Only project owner can close the project",
      });
    }

    // Validate current status
    if (project.status !== "submitted") {
      return res.status(400).json({
        error: `Cannot close. Project status must be 'submitted', current status is '${project.status}'`,
      });
    }

    // Update project status
    project.status = "completed";
    project.completedAt = new Date();
    await project.save();

    console.log(`✅ Project ${projectId} closed by customer ${customerId}`);

    res.json({
      success: true,
      message: "Project closed successfully. You can now submit ratings and reviews.",
      project,
      status: "completed",
    });
  } catch (err) {
    console.error("❌ Error closing project:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /workflow/projects/:projectId/rate
 * Both contractor and customer can rate each other (completed → closed when both rated)
 */
router.patch("/projects/:projectId/rate", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;
    const { rating, comment, ratedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    if (comment && (comment.length < 10 || comment.length > 1000)) {
      return res.status(400).json({
        error: "Comment must be between 10 and 1000 characters",
      });
    }

    // Get project
    const project = await ProjectRequest.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Validate project status
    if (project.status !== "completed") {
      return res.status(400).json({
        error: `Cannot rate. Project status must be 'completed', current status is '${project.status}'`,
      });
    }

    // Get accepted proposal
    const proposal = await Proposal.findOne({
      project: projectId,
      status: "accepted",
    });

    if (!proposal) {
      return res.status(404).json({ error: "No accepted proposal found" });
    }

    // Determine if user is contractor or customer
    const isContractor = proposal.contractor.toString() === userId.toString();
    const isCustomer = project.customer.toString() === userId.toString();

    if (!isContractor && !isCustomer) {
      return res.status(403).json({
        error: "You are not authorized to rate this project",
      });
    }

    // Check for duplicate rating
    if (isContractor && project.contractorRated) {
      return res.status(400).json({
        error: "Contractor has already submitted a rating for this project",
      });
    }

    if (isCustomer && project.customerRated) {
      return res.status(400).json({
        error: "Customer has already submitted a rating for this project",
      });
    }

    // Create review record
    const review = new Review({
      project: projectId,
      proposal: proposal._id,
      contractor: proposal.contractor,
      customer: project.customer,
      ratedBy: isContractor ? "contractor" : "customer",
      raterName: isContractor ? proposal.contractor.name : project.customer.name,
      rating,
      comment: comment || "",
      isPublic: true,
    });

    await review.save();

    // Update project rating flags
    if (isContractor) {
      project.contractorRated = true;
    } else {
      project.customerRated = true;
    }

    // If both have rated, update status to "closed"
    if (project.contractorRated && project.customerRated) {
      project.status = "closed";
      project.closedAt = new Date();
      console.log(`✅ Project ${projectId} fully closed - both parties have rated`);
    }

    await project.save();

    // Update contractor average rating if this is a customer rating
    if (isCustomer) {
      const avgRating = await Review.aggregate([
        { $match: { contractor: proposal.contractor, ratedBy: "customer" } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]);

      if (avgRating.length > 0) {
        await Contractor.findByIdAndUpdate(proposal.contractor, {
          rating: Math.round(avgRating[0].avgRating * 10) / 10,
        });
      }
    }

    res.json({
      success: true,
      message: project.contractorRated && project.customerRated
        ? "Rating submitted. Project fully closed!"
        : "Rating submitted successfully. Waiting for other party...",
      review,
      project,
      projectStatus: project.status,
    });
  } catch (err) {
    console.error("❌ Error submitting rating:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /workflow/projects/:projectId/workflow-status
 * Get current workflow status and available actions
 */
router.get("/projects/:projectId/workflow-status", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await ProjectRequest.findById(projectId)
      .populate("customer", "name email")
      .populate("acceptedProposal");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const proposal = await Proposal.findOne({
      project: projectId,
      status: "accepted",
    }).populate("contractor", "name email");

    const isContractor = proposal?.contractor._id.toString() === userId.toString();
    const isCustomer = project.customer._id.toString() === userId.toString();

    const workflowStatus = {
      currentStatus: project.status,
      submittedAt: project.submittedAt,
      completedAt: project.completedAt,
      closedAt: project.closedAt,
      contractorRated: project.contractorRated,
      customerRated: project.customerRated,
      contractor: {
        name: proposal?.contractor.name,
        hasRated: project.contractorRated,
      },
      customer: {
        name: project.customer.name,
        hasRated: project.customerRated,
      },
      availableActions: {
        contractorCanSubmit: isContractor && project.status === "in_progress",
        customerCanClose: isCustomer && project.status === "submitted",
        contractorCanRate: isContractor && project.status === "completed" && !project.contractorRated,
        customerCanRate: isCustomer && project.status === "completed" && !project.customerRated,
      },
      messages: {
        status: getStatusMessage(project.status, isContractor, project),
        nextAction: getNextActionMessage(project.status, isContractor, isCustomer, project),
      },
    };

    res.json(workflowStatus);
  } catch (err) {
    console.error("❌ Error getting workflow status:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Helper function to get human-readable status message
 */
function getStatusMessage(status, isContractor, project) {
  const messages = {
    in_progress: "🔨 Work in progress. Contractor is working on the project.",
    submitted: "✅ Work submitted. Waiting for customer approval.",
    completed: "🎉 Project completed. Both parties can now submit ratings.",
    closed: "✔️ Project fully closed. All ratings submitted.",
  };
  return messages[status] || `Status: ${status}`;
}

/**
 * Helper function to get next action message
 */
function getNextActionMessage(status, isContractor, isCustomer, project) {
  if (status === "in_progress") {
    return isContractor ? "→ Submit your work as complete" : "→ Waiting for contractor to submit";
  }
  if (status === "submitted") {
    return isCustomer ? "→ Review and close the project" : "→ Waiting for customer approval";
  }
  if (status === "completed") {
    if (isContractor && !project.contractorRated) return "→ Submit your rating";
    if (isCustomer && !project.customerRated) return "→ Submit your rating";
    return "→ Waiting for ratings from other party";
  }
  if (status === "closed") {
    return "✓ Project complete! All ratings submitted.";
  }
  return "";
}

module.exports = router;
