import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/RatingSubmission.css";

const BASE_URL = import.meta.env.VITE_API_URL;
const RatingSubmission = ({ projectId, userRole, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [projectStatus, setProjectStatus] = useState("");
  const [hasRated, setHasRated] = useState(false);
  const [otherPartyName, setOtherPartyName] = useState("");

  const MAX_COMMENT_LENGTH = 1000;
  const MIN_COMMENT_LENGTH = 10;

  // Get token from localStorage
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("contractorToken") ||
      localStorage.getItem("customerToken") ||
      localStorage.getItem("authToken")
    );
  };

  useEffect(() => {
    // Fetch project status
    const fetchStatus = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("Not authenticated. Please log in.");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/workflow/projects/${projectId}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const project = response.data.project;
        setProjectStatus(project.status);

        // Set if current user has already rated
        if (userRole === "contractor") {
          setHasRated(project.contractorRated);
          setOtherPartyName(response.data.acceptedProposal?.contractor?.name || "Contractor");
        } else {
          setHasRated(project.customerRated);
          setOtherPartyName(project.customer?.name || "Customer");
        }
      } catch (err) {
        console.error("Error fetching project status:", err);
        if (err.response?.status === 401) {
          setError("Authentication expired. Please log in again.");
        }
      }
    };

    fetchStatus();
  }, [projectId, userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.length < MIN_COMMENT_LENGTH) {
      setError(`Comment must be at least ${MIN_COMMENT_LENGTH} characters`);
      return;
    }

    if (comment.length > MAX_COMMENT_LENGTH) {
      setError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const token = getToken();
      if (!token) {
        setError("Not authenticated. Please log in.");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.patch(
        `${BASE_URL}/workflow/projects/${projectId}/rate`,
        {
          rating,
          comment,
          ratedBy: userRole,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(response.data.message);
      setHasRated(true);
      setRating(0);
      setComment("");

      // Call parent callback
      if (onSuccess) {
        onSuccess(response.data.project);
      }

      // Close form and show success
      setShowForm(false);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error submitting rating:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError(err.response.data.error || "You're not authorized to rate this project.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || "Cannot submit rating at this time.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Backend server not running. Start with: npm start");
      } else {
        setError(err.response?.data?.error || "Failed to submit rating. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show anything if project is not completed or already rated
  if (projectStatus !== "completed" || hasRated) {
    return null;
  }

  return (
    <div className="rating-submission">
      {!showForm && (
        <button className="btn btn-info" onClick={() => setShowForm(true)}>
          ⭐ Submit Your Rating & Review
        </button>
      )}

      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}

      {showForm && (
        <div className="rating-form-container">
          <div className="rating-form-header">
            <h5>Rate Your Experience</h5>
            <button className="close-btn" onClick={() => setShowForm(false)}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="form-group">
              <label>How would you rate this project?</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className={`star ${num <= (hoverRating || rating) ? "filled" : ""}`}
                    onClick={() => setRating(num)}
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="rating-value">
                {rating > 0 ? `${rating} / 5 Stars` : "Select a rating"}
              </p>
            </div>

            {/* Comment */}
            <div className="form-group">
              <label>Share Your Feedback (Optional but Appreciated)</label>
              <textarea
                className="form-control"
                placeholder="Share your experience working on this project..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              />
              <small className="form-text text-muted">
                {comment.length}/{MAX_COMMENT_LENGTH} characters
                {comment.length > 0 && comment.length < MIN_COMMENT_LENGTH && (
                  <span className="text-danger"> (minimum {MIN_COMMENT_LENGTH})</span>
                )}
              </small>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <p>
                <strong>ℹ️ Your rating helps maintain trust in our community.</strong> Please be honest and fair in your assessment.
              </p>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RatingSubmission;
