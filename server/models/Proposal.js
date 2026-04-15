const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  contractor: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectRequest", required: true },
  price: { type: Number, required: true },
  message: { type: String },

  // ✅ NEW FIELD
  completionTime: { type: String, required: true },

  isWorkReportingEnabled: {
    type: Boolean,
    default: false,
  },

  status: { type: String, enum: ["pending", "accepted","shortlisted","rejected","in_progress","submitted","completed","closed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Proposal", proposalSchema);