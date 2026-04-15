import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewSubmission.css";

const ReviewSubmission = ({ projectId, customerId, contractorId, onReviewSubmitted }) => {
  const [project, setProject] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    fetchReviewStatus();
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    if (!projectId) return;

    try {
      const token =
  localStorage.getItem("customerToken") ||
  localStorage.getItem("token");
      const idToUse = typeof projectId === "object" ? projectId?._id : projectId;

      if (!idToUse) return;

      const response = await axios.get(
        `http://localhost:5000/projects/${idToUse}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProject(response.data.project);
    } catch (err) {
      console.warn("Could not fetch project details. Backend may not be running.", err.message);
      // Continue without project details
    }
  };

  const fetchReviewStatus = async () => {
    if (!projectId || !customerId) return;

    try {
      const token =
  localStorage.getItem("customerToken") ||
  localStorage.getItem("token");
      const idToUse = typeof projectId === "object" ? projectId?._id : projectId;

      if (!idToUse) return;

      const response = await axios.get(
        `http://localhost:5000/projects/${idToUse}/review-status?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviewStatus(response.data);
      if (response.data.review) {
        setExistingReview(response.data.review);
        setRating(response.data.review.rating);
        setComment(response.data.review.comment);
        setIsPublic(response.data.review.isPublic);
      }
    } catch (err) {
      console.warn("Could not fetch review status. Backend may not be running.", err.message);
      // Set default review status
      setReviewStatus({ canReview: true, reason: "" });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token =
  localStorage.getItem("customerToken") ||
  localStorage.getItem("token");
      
      const idToUse = typeof projectId === "object" ? projectId?._id : projectId;

      if (!idToUse) {
        setError("Invalid project ID");
        setLoading(false);
        return;
      }

      // Get customer name from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const customerName = user?.name || "Customer";

      console.log("🔍 [REVIEW] Submitting review...");
      console.log("   - projectId:", idToUse);
      console.log("   - customerId:", customerId);
      console.log("   - rating:", rating);
      console.log("   - customerName:", customerName);

      const reviewData = {
        customerId,
        rating,
        comment: comment.trim(),
        isPublic,
        ratedBy: "customer",
        raterName: customerName,
      };

      const response = await axios.post(
        `http://localhost:5000/projects/${idToUse}/review`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ [REVIEW] Successfully submitted:", response.data);
      setSuccess(true);
      setExistingReview(response.data.review);

      if (onReviewSubmitted) {
        onReviewSubmitted(response.data.review);
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("❌ [REVIEW] Error submitting review:", err);
      console.error("   - Status:", err.response?.status);
      console.error("   - Data:", err.response?.data);
      if (err.response?.status === 404 || err.code === "ERR_NETWORK") {
        setError("Backend server is not running. Please start the backend with 'npm start' in the server folder.");
      } else {
        setError(err.response?.data?.error || "Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!reviewStatus) {
    return <div className="review-loading">Loading...</div>;
  }

  if (reviewStatus.projectStatus === "in_progress") {
  return (
    <div className="review-container">
      <div className="review-card">
        <div className="review-unavailable">
          <div className="info-icon">ℹ</div>
          <p>
            Contractor has not submitted work yet.
          </p>
        </div>
      </div>
    </div>
  );
}

if (reviewStatus.projectStatus === "submitted") {
  return (
    <div className="review-container">
      <div className="review-card">
        <div className="review-unavailable">
          <div className="info-icon">⚠</div>
          <p>
            Please close the project first before submitting a review.
          </p>
        </div>
      </div>
    </div>
  );
}

  const contractorName = project?.title || "Project";

  return (
    <div className="review-container">
      <div className="review-card">
        <h3 className="review-title">
          {existingReview ? "Your Review" : "Submit Your Review"}
        </h3>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            ✓ Your review has been submitted successfully!
          </div>
        )}

        {existingReview && !success ? (
          <div className="existing-review">
            <div className="review-content">
              <div className="review-header">
                <div className="rating-display">
                  <span className="stars">
                    {"★".repeat(existingReview.rating)}
                    {"☆".repeat(5 - existingReview.rating)}
                  </span>
                  <span className="rating-text">
                    {existingReview.rating} out of 5
                  </span>
                </div>
                <span className={`visibility-badge ${existingReview.isPublic ? "public" : "private"}`}>
                  {existingReview.isPublic ? "Public" : "Private"}
                </span>
              </div>
              <p className="review-comment">{existingReview.comment}</p>
              <div className="review-meta">
                <small>
                  Submitted on{" "}
                  {new Date(existingReview.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label className="label">Rating</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${
                      star <= (hoverRating || rating) ? "active" : ""
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <span className="rating-text">
                  {rating} out of 5 stars
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="comment" className="label">
                Your Review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this contractor, their professionalism, quality of work, etc. (minimum 10 characters)"
                className="textarea"
                rows="6"
                disabled={loading}
              />
              <div className="char-count">
                {comment.length} / 1000 characters
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="isPublic" className="checkbox-label">
                Make this review public (others can see this review on the
                contractor's profile)
              </label>
            </div>

            <button
              type="submit"
              className="btn-submit-review"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {existingReview && (
        <div className="review-info-box">
          <h4>About Reviews</h4>
          <ul>
            <li>Reviews help other customers make informed decisions</li>
            <li>
              Your honest feedback helps contractors improve their services
            </li>
            <li>Public reviews are visible on contractor profiles</li>
            <li>Each project can have one review</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmission;
