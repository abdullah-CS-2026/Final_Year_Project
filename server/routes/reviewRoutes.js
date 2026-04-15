const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const Review = require("../models/Review");
const Contractor = require("../models/Contractor");

const router = express.Router();

/**
 * GET /reviews/contractor/:contractorId
 * Get all reviews for a contractor (public reviews)
 */
router.get("/contractor/:contractorId", async (req, res) => {
  try {
    const { contractorId } = req.params;
    const { includePrivate } = req.query;

    console.log("🔍 [REVIEWS GET] Fetching reviews for contractor:", contractorId);

    if (!mongoose.Types.ObjectId.isValid(contractorId)) {
      console.error("❌ [REVIEWS] Invalid contractor ID:", contractorId);
      return res.status(400).json({ error: "Invalid contractor ID" });
    }

    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
      console.error("❌ [REVIEWS] Contractor not found:", contractorId);
      return res.status(404).json({ error: "Contractor not found" });
    }

    console.log("✅ [REVIEWS] Contractor found:", contractor.name);

    // Build query
    let query = {
      contractor: contractorId,
    };

    // Only include public reviews unless specifically requested
    if (!includePrivate) {
      query.isPublic = true;
    }

    const reviews = await Review.find(query)
      .populate("customer", "name profilePic")
      .populate("project", "title category")
      .sort({ createdAt: -1 });

    console.log("✅ [REVIEWS] Retrieved", reviews.length, "reviews for contractor");

    // Calculate statistics
    const stats = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
          : 0,
      ratingDistribution: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };

    console.log("📊 [REVIEWS] Stats - Average Rating:", stats.averageRating, "| Total:", stats.totalReviews);

    res.json({
      contractor: {
        id: contractor._id,
        name: contractor.name,
        profilePic: contractor.profilePic,
        totalProjects: contractor.totalProjects,
        currentRating: contractor.rating,
      },
      reviews,
      stats,
    });
  } catch (err) {
    console.error("❌ [REVIEWS] Error fetching reviews:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /reviews/contractor/:contractorId/summary
 * Get quick contractor rating summary
 */
router.get("/contractor/:contractorId/summary", async (req, res) => {
  try {
    const { contractorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contractorId)) {
      return res.status(400).json({ error: "Invalid contractor ID" });
    }

    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({ error: "Contractor not found" });
    }

    const reviews = await Review.find({
      contractor: contractorId,
      isPublic: true,
    });

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
            1
          )
        : 0;

    res.json({
      contractorId,
      contractorName: contractor.name,
      totalReviews: reviews.length,
      averageRating: parseFloat(avgRating),
      totalCompletedProjects: contractor.totalProjects,
      ratingDistribution,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /reviews/:reviewId
 * Get a specific review
 */
router.get("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId)
      .populate("customer", "name profilePic")
      .populate("contractor", "name profilePic")
      .populate("project", "title category");

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // If not public, only contractor and customer can view
    if (!review.isPublic) {
      // Add auth check here if needed
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /reviews/:reviewId
 * Update review visibility (contractor only)
 */
router.put(
  "/:reviewId/visibility",
  authMiddleware,
  async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { isPublic } = req.body;
      const { contractorId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }

      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      // Only contractor can change visibility
      if (review.contractor.toString() !== contractorId) {
        return res.status(403).json({
          error: "Only the contractor can change review visibility",
        });
      }

      review.isPublic = isPublic;
      await review.save();

      res.json({
        message: "Review visibility updated",
        review,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * DELETE /reviews/:reviewId
 * Delete a review (customer only, soft delete via status)
 */
router.delete("/:reviewId", authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { customerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Only customer who submitted the review can delete
    if (review.customer.toString() !== customerId) {
      return res.status(403).json({
        error: "Only review author can delete",
      });
    }

    // Mark as rejected instead of deleting
    review.status = "rejected";
    await review.save();

    res.json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
