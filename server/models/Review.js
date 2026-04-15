const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  // Core References
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectRequest",
    required: true,
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contractor",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
    required: true,
  },

  // Review Content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },

  // Track who submitted the rating
  ratedBy: {
    type: String,
    enum: ["contractor", "customer"],
    required: true,
  },
  raterName: {
    type: String,
    required: true, // Store name for display purposes
  },

  // Visibility
  isPublic: {
    type: Boolean,
    default: true, // Reviews are public by default
  },

  // Status
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for faster queries
ReviewSchema.index({ contractor: 1, isPublic: 1 });
ReviewSchema.index({ customer: 1 });
ReviewSchema.index({ project: 1 });

module.exports = mongoose.model("Review", ReviewSchema);
