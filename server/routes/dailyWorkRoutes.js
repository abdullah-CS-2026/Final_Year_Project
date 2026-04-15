const express = require("express");
const DailyWork = require("../models/DailyWork");
const Proposal = require("../models/Proposal");
const router = express.Router();

/**
 * Contractor submits daily work
 */
router.post("/", async (req, res) => {
  try {
    const { proposalId, contractorId, entry } = req.body;

    const proposal = await Proposal.findById(proposalId);

    // ❌ proposal not found
    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found",
      });
    }

    // ❌ proposal not accepted
    if (proposal.status !== "accepted") {
      return res.status(400).json({
        message: "Proposal not accepted",
      });
    }

    // ❌ reporting OFF (MAIN CHECK)
    if (proposal.isWorkReportingEnabled !== true) {
      return res.status(403).json({
        message: "Customer has disabled daily reporting",
      });
    }

    // ✅ save work
    const dailyWork = new DailyWork({
      proposal: proposalId,
      contractor: contractorId,
      customer: proposal.customer,
      ...entry,
    });

    await dailyWork.save();

    res.status(201).json({
      message: "Daily work saved",
      dailyWork,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
/**
 * Get daily work by proposal
 */
router.get("/:proposalId", async (req, res) => {
  try {
    const works = await DailyWork.find({
      proposal: req.params.proposalId,
    }).sort({ date: -1 });

    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
