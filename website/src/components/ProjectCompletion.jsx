import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProjectCompletion.css";

const ProjectCompletion = ({ projectId, contractorId, onCompleted }) => {
  const [project, setProject] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/projects/${projectId}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProject(response.data.project);
      setProposal(response.data.proposal);
      setIsCompleted(response.data.project.status === "completed");
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError("Failed to load project details");
    }
  };

  const handleMarkComplete = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

     
      setProject(response.data.project);
      setProposal(response.data.proposal);
      setIsCompleted(true);
      setShowConfirmation(false);

      // Notify parent component
      if (onCompleted) {
        onCompleted(response.data);
      }
    } catch (err) {
      console.error("Error marking project complete:", err);
      setError(
        err.response?.data?.error || "Failed to mark project as complete"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div className="project-completion-loading">Loading...</div>;
  }

  return (
    <div className="project-completion-container">
      <div className="completion-card">
        <h3 className="completion-title">Project Status</h3>

        <div className="project-info">
          <div className="info-row">
            <span className="label">Project:</span>
            <span className="value">{project.title}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span
              className={`status-badge ${project.status}`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!isCompleted && project.status !== "closed" && (
          <div className="completion-section">
            <p className="completion-description">
              Mark this project as completed once all work is finalized and ready
              for customer review.
            </p>

            {showConfirmation ? (
              <div className="confirmation-modal">
                <div className="modal-content">
                  <h4>Confirm Project Completion</h4>
                  <p>
                    Are you sure you've completed all work for this project?
                    The customer will then be able to close the project and
                    leave a review.
                  </p>
                  <div className="modal-actions">
                    <button
                      className="btn-cancel"
                      onClick={() => setShowConfirmation(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-confirm"
                      onClick={handleMarkComplete}
                      disabled={loading}
                    >
                      {loading ? "Completing..." : "Yes, Mark as Complete"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="btn-mark-complete"
                onClick={() => setShowConfirmation(true)}
                disabled={loading}
              >
                Mark as Completed
              </button>
            )}
          </div>
        )}

        {isCompleted && (
          <div className="completion-success">
            <div className="success-icon">✓</div>
            <p>
              Project marked as completed. The customer will now be able to
              close the project.
            </p>
          </div>
        )}

        {project.status === "closed" && (
          <div className="completion-closed">
            <p>This project has been closed by the customer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCompletion;
