const mongoose = require("mongoose");

const ProjectRequestSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Customer", 
    required: true 
  },

  // Basic details
  title: { type: String, required: true }, // e.g. "Build a 5 Marla House"
  category: { 
    type: String, 
    enum: ["house", "commercial", "renovation", "interior"], 
    required: true 
  },
  location: { type: String, required: true },
  plotSize: { type: String, required: true }, // e.g. "10 Marla"
  budget: { type: Number }, // optional
  description: { type: String },

  // New fields from form
  deadline: { type: Date, required: true },
  urgency: { type: String, enum: ["normal", "urgent"], default: "normal" },

  // File uploads
  attachments: [{ type: String }], // store file paths or URLs

  // Project status workflow
  status: { 
    type: String, 
    enum: [
      "pending",
      "accepted",
      "shortlisted",
      "rejected",
      "in_progress",
      "submitted",      // ← Contractor marks work as complete
      "completed",      // ← Customer approves completion
      "closed"          // ← Both have rated each other
    ], 
    default: "pending" 
  },

  // Completion tracking
  submittedAt: { type: Date },      // When contractor marks as submitted
  completedAt: { type: Date },      // When customer marks as completed
  closedAt: { type: Date },         // When both have rated

  // Rating tracking
  contractorRated: { type: Boolean, default: false },  // Has contractor rated customer?
  customerRated: { type: Boolean, default: false },    // Has customer rated contractor?

  // Accepted proposal reference
  acceptedProposal: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Proposal",
    default: null 
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ProjectRequest = mongoose.model("ProjectRequest", ProjectRequestSchema);

module.exports = ProjectRequest;
