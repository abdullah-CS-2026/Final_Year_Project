const mongoose = require("mongoose");

const dailyWorkSchema = new mongoose.Schema({
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
    required: true,
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contractor",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  materials: [
    {
      name: String,
      qty: Number,
      price: Number,
      total: Number,
    },
  ],
  labourCount: Number,
  labourCost: Number,
  miscList: [
    {
      miscItem: String,
      miscQty: Number,
      miscPrice: Number,
    },
  ],
  materialTotal: Number,
  additionalTotal: Number,
  total: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DailyWork", dailyWorkSchema);
