import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/ConfirmationModal.css";

const ContractorSubmitWork = ({ projectId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [projectStatus, setProjectStatus] = useState("");

  // Get token from localStorage
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("contractorToken") ||
      localStorage.getItem("authToken")
    );
  };

  useEffect(() => {
    // Fetch project status to check if can submit
    const fetchStatus = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("Not authenticated. Please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/workflow/projects/${projectId}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProjectStatus(response.data.project.status);
      } catch (err) {
        console.error("Error fetching project status:", err);
        if (err.response?.status === 401) {
          setError("Authentication expired. Please log in again.");
        }
      }
    };

    fetchStatus();
  }, [projectId]);

  const handleSubmit = async () => {
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
        `http://localhost:5000/workflow/projects/${projectId}/submit`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(response.data.message);
      setShowConfirmation(false);
      setProjectStatus("submitted");

      // Call parent callback
      if (onSuccess) {
        onSuccess(response.data.project);
      }

      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error submitting work:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError(err.response.data.error || "You don't have permission to submit this project.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || "Cannot submit project at this time.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Backend server not running. Start with: npm start");
      } else {
        setError(err.response?.data?.error || "Failed to submit work. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show button if not in in_progress status
  if (projectStatus !== "in_progress") {
    return null;
  }

  return (
    <div className="contractor-submit-work">
      <button
        className="btn btn-success"
        onClick={() => setShowConfirmation(true)}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "✓ Mark Work as Submitted"}
      </button>

      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-header">
              <h4>Submit Work for Review</h4>
              <button
                className="close-btn"
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <div className="confirmation-body">
              <p className="confirmation-message">
                By submitting your work, you're notifying the customer that the project is ready for review and approval.
              </p>
              <p className="confirmation-warning">
                <strong>⚠️ Important:</strong> Once submitted, the customer will have 7 days to review and approve your work.
              </p>
            </div>

            <div className="confirmation-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit Work"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorSubmitWork;
