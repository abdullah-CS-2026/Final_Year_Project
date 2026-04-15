import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/ConfirmationModal.css";

const CustomerCloseProject = ({ projectId, onSuccess }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [projectStatus, setProjectStatus] = useState("");
  const [contractorName, setContractorName] = useState("");

  // Get token from localStorage
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("customerToken") ||
      localStorage.getItem("authToken")
    );
  };

  useEffect(() => {
    // Fetch project status to check if can close
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
        if (response.data.acceptedProposal?.contractor?.name) {
          setContractorName(response.data.acceptedProposal.contractor.name);
        }
      } catch (err) {
        console.error("Error fetching project status:", err);
        if (err.response?.status === 401) {
          setError("Authentication expired. Please log in again.");
        }
      }
    };

    fetchStatus();
  }, [projectId]);

  const handleClose = async () => {
    try {
      setIsClosing(true);
      setError("");
      setSuccess("");

      const token = getToken();
      if (!token) {
        setError("Not authenticated. Please log in.");
        setIsClosing(false);
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/workflow/projects/${projectId}/close`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(response.data.message);
      setShowConfirmation(false);
      setProjectStatus("completed");

      // Call parent callback
      if (onSuccess) {
        onSuccess(response.data.project);
      }

      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error closing project:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError(err.response.data.error || "You don't have permission to close this project.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || "Cannot close project at this time.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Backend server not running. Start with: npm start");
      } else {
        setError(err.response?.data?.error || "Failed to close project. Please try again.");
      }
    } finally {
      setIsClosing(false);
    }
  };

  // Don't show button if not in submitted status
  if (projectStatus !== "submitted") {
    return null;
  }

  return (
    <div className="customer-close-project">
      <button
        className="btn btn-success"
        onClick={() => setShowConfirmation(true)}
        disabled={isClosing}
      >
        {isClosing ? "Closing..." : "✓ Approve & Close Project"}
      </button>

      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-header">
              <h4>Close & Approve Project</h4>
              <button
                className="close-btn"
                onClick={() => setShowConfirmation(false)}
                disabled={isClosing}
              >
                ✕
              </button>
            </div>

            <div className="confirmation-body">
              <p className="confirmation-message">
                By approving and closing this project, you confirm that you are satisfied with the work completed by{" "}
                <strong>{contractorName}</strong>.
              </p>
              <p className="confirmation-info">
                <strong>ℹ️ Next Step:</strong> After closing, you and the contractor will both be able to submit ratings and reviews.
              </p>
            </div>

            <div className="confirmation-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmation(false)}
                disabled={isClosing}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleClose}
                disabled={isClosing}
              >
                {isClosing ? "Closing..." : "Yes, Approve & Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCloseProject;
