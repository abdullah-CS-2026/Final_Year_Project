// proposalRoutes.js
const express = require("express");
const Proposal = require("../models/Proposal");
const ProjectRequest = require("../models/ProjectRequest");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

/**
 * Contractor submits a proposal
 */
router.post("/", async (req, res) => {
  try {
    const { contractorId, projectId, price, message, completionTime } = req.body;

    const project = await ProjectRequest.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Get customer from project
    const customerId = project.customer;

    const proposal = new Proposal({
      contractor: contractorId,
      project: projectId,
      customer: customerId,
      price,
      message,
      completionTime,
      status: "pending", // explicit for clarity
      isWorkReportingEnabled: false, // ⭐ FORCE SAVE
    });

    await proposal.save();

    res.status(201).json({ message: "Proposal submitted successfully", proposal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Customer sees all proposals for all their projects
 */
router.get("/customer/:customerId", async (req, res) => {
  try {
    const projects = await ProjectRequest.find({ customer: req.params.customerId });
    const projectIds = projects.map((p) => p._id);

    const proposals = await Proposal.find({ project: { $in: projectIds } })
      .populate("contractor", "name email phone profilePic")
      .populate("project", "title budget location");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Contractor sees all proposals they have sent
 */
router.get("/contractor/:contractorId", async (req, res) => {
  try {
    const proposals = await Proposal.find({
      contractor: req.params.contractorId,
    })
      .populate("project", "title budget location")
      .populate("customer", "name email phone");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Customer sees proposals for a single project
 */
router.get("/:projectId", async (req, res) => {
  try {
    const proposals = await Proposal.find({ project: req.params.projectId })
      .populate("contractor", "name email phone profilePic");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get shortlisted proposals for a customer
router.get("/customer/:customerId/shortlisted", async (req, res) => {
  try {
    const projects = await ProjectRequest.find({ customer: req.params.customerId });
    const projectIds = projects.map((p) => p._id);

    const proposals = await Proposal.find({
      project: { $in: projectIds },
      status: "shortlisted",
    })
      .populate("contractor", "name email phone profilePic")
      .populate("project", "title budget location");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Customer "accepts" (shortlists) a proposal
 * NOTE: I've kept the path `/accept` but set status to "shortlisted" to match the frontend.
 * If you want a separate final-accept step, add a separate `/finalize` or `/confirm` endpoint.
 */

router.put("/:id/accept", authMiddleware, async (req, res) => {
  try {
    const proposalId = req.params.id;
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (proposal.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Step-based status update
    if (proposal.status === "pending") {
  proposal.status = "shortlisted";

  // ✅ CHAT AUTO CREATE ON SHORTLIST
  const ChatRoom = require("../models/ChatRoom");

  let chatRoom = await ChatRoom.findOne({ proposal: proposal._id });

  if (!chatRoom) {
    chatRoom = new ChatRoom({
      proposal: proposal._id,
      customer: proposal.customer,
      contractor: proposal.contractor,
    });
    await chatRoom.save();
  }
}
    else if (proposal.status === "shortlisted") {
      proposal.status = "accepted";
       // ✅ ADD THIS (CRITICAL FIX)
  const project = await ProjectRequest.findById(proposal.project);

  if (project) {
    project.status = "in_progress";
    project.acceptedProposal = proposal._id;
    await project.save();
  }

       // ✅ DEBUG LINE (ADD THIS)
  console.log(
    "🚨 Sending notification to contractor:",
    proposal.contractor.toString()
  );
  console.log("Active rooms:", global.io.sockets.adapter.rooms);
        // ✅ SEND REALTIME NOTIFICATION TO CONTRACTOR
  global.io
    .to(proposal.contractor.toString())
    .emit("newNotification", {
      message: "🎉 Your proposal has been accepted!",
      projectId: proposal.project,
      type: "proposal_accepted",
    });


      // When a proposal is accepted, remove all remaining proposals
      // for the same customer and the same originally requested project category.
      // This removes proposals across the customer's projects that share the
      // same `category` (project type), except for the accepted proposal.
      try {
        const acceptedProject = await ProjectRequest.findById(proposal.project);
        if (acceptedProject) {
          const category = acceptedProject.category;

          // Find all projects for this customer with the same category
          const relatedProjects = await ProjectRequest.find({
            customer: proposal.customer,
            category,
          });

          const relatedProjectIds = relatedProjects.map((p) => p._id);

          // Delete all proposals for those projects except the accepted one
          await Proposal.deleteMany({
            project: { $in: relatedProjectIds },
            _id: { $ne: proposal._id },
          });
        }
      } catch (err) {
        // Log error but don't block the response
        console.error('Error removing related proposals after acceptance:', err.message);
      }
    }

    await proposal.save();

    res.json({ message: `Proposal ${proposal.status}`, proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Customer rejects a proposal — mark as rejected (do not delete)
 */
router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    const proposalId = req.params.id;
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ error: "Proposal not found" });

    if (proposal.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    proposal.status = "rejected";
    await proposal.save();

    res.json({ message: "Proposal rejected", proposal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get accepted proposals for a customer (if you ever need a final accepted state)
router.get("/customer/:customerId/accepted", async (req, res) => {
  try {
    const projects = await ProjectRequest.find({ customer: req.params.customerId });
    const projectIds = projects.map((p) => p._id);

    const proposals = await Proposal.find({
      project: { $in: projectIds },
      status: "accepted",
    })
      .populate("contractor", "name email phone profilePic")
      .populate("project", "title budget location");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * Contractor sees all proposals they have sent
 */
router.patch("/toggle-work/:proposalId", async (req, res) => {
  try {
    const { proposalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      return res.status(400).json({ message: "Invalid proposal id" });
    }

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    proposal.isWorkReportingEnabled = !proposal.isWorkReportingEnabled;
    await proposal.save();

    res.json({
      message: "Work reporting updated",
      isWorkReportingEnabled: proposal.isWorkReportingEnabled,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get single proposal (for permission check)
router.get("/get-single/:proposalId", async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId);

    if (!proposal)
      return res.status(404).json({ message: "Proposal not found" });

    res.json(proposal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
