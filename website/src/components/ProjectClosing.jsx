import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProjectClosing.css";

const ProjectClosing = ({ projectId, customerId, onClosed }) => {
  const [project, setProject] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(1); // 1: initial, 2: checkbox confirmation

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    if (!projectId) {
      setError("Project ID is missing");
      return;
    }

    try {
      // Get token from any possible storage location
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("customerToken") ||
        localStorage.getItem("contractorToken");

      if (!token) {
        console.warn("⚠️ No token found in localStorage. User may not be logged in.");
        setProject({ _id: projectId, status: "in-progress" });
        setIsClosed(false);
        return;
      }

      // Extract ID if projectId is an object
      const idToUse = typeof projectId === "object" ? projectId?._id : projectId;

      if (!idToUse) {
        setError("Invalid project ID format");
        return;
      }

      console.log("📡 Fetching project details with token:", token.substring(0, 20) + "...");

      const response = await axios.get(
        `http://localhost:5000/projects/${idToUse}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProject(response.data.project);
      setProposal(response.data.proposal);
      setIsClosed(response.data.project.status === "closed");
    } catch (err) {
      // Handle 401 Unauthorized specifically
      if (err.response?.status === 401) {
        console.error("❌ 401 Unauthorized - Token is invalid or expired");
        console.error("Please check:");
        console.error("1. Are you logged in? Check localStorage for token");
        console.error("2. Is token valid? Try logging in again");
        console.error("3. Does token match backend JWT_SECRET?");
        setError("Authentication failed. Please log in again.");
      } else if (err.code === "ERR_NETWORK") {
        console.warn("❌ Cannot reach backend. Make sure server is running on port 5000");
        setProject({ _id: projectId, status: "in-progress" });
        setIsClosed(false);
      } else {
        console.warn("Could not fetch project details:", err.message);
        setProject({ _id: projectId, status: "in-progress" });
        setIsClosed(false);
      }
    }
  };

  const handleCloseProject = async () => {
    try {
      setLoading(true);
      setError("");
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("customerToken") ||
        localStorage.getItem("contractorToken");

      if (!token) {
        setError("❌ Token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      // Extract ID if projectId is an object
      const idToUse = typeof projectId === "object" ? projectId?._id : projectId;

      if (!idToUse) {
        setError("Invalid project ID");
        setLoading(false);
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/projects/${idToUse}/close`,
        {
          customerId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProject(response.data.project);
      setIsClosed(true);
      setShowConfirmation(false);

      // Notify parent component
      if (onClosed) {
        onClosed(response.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("❌ Authentication failed. Please log in again.");
      } else if (err.response?.status === 404) {
        setError("❌ Project not found or backend route not registered.");
      } else if (err.code === "ERR_NETWORK") {
        setError("❌ Backend server not running. Start with: npm start");
      } else {
        setError(err.response?.data?.error || "Failed to close project");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div className="project-closing-loading">Loading...</div>;
  }

  const canClose = project.status === "completed";
  const contractorName = proposal?.contractor?.name || "Contractor";

  return (
    <div className="project-closing-container">
      <div className="closing-card">
        <h3 className="closing-title">Close Project</h3>

        <div className="project-info">
          <div className="info-row">
            <span className="label">Project:</span>
            <span className="value">{project.title}</span>
          </div>
          <div className="info-row">
            <span className="label">Contractor:</span>
            <span className="value">{contractorName}</span>
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

        {!isClosed && (
          <div className="closing-section">
            {!canClose && (
              <div className="warning-box">
                <div className="warning-icon">⚠</div>
                <p>
                  The contractor must mark the project as completed before you
                  can close it. Currently, the project status is{" "}
                  <strong>{project.status}</strong>.
                </p>
              </div>
            )}

            {canClose && (
              <>
                <p className="closing-description">
                  Once you close this project, you'll be asked to submit a
                  rating and review for the contractor. This action cannot be
                  undone.
                </p>

                {showConfirmation ? (
                  <div className="confirmation-modal">
                    <div className="modal-content">
                      <h4>Close Project - Confirmation</h4>

                      {confirmationStep === 1 ? (
                        <>
                          <p>
                            Before closing, please note:
                          </p>
                          <ul className="confirmation-list">
                            <li>
                              No further updates or uploads will be allowed
                            </li>
                            <li>
                              You will be required to submit a rating and
                              review
                            </li>
                            <li>
                              The contractor will be notified of project closure
                            </li>
                          </ul>
                          <div className="modal-actions">
                            <button
                              className="btn-cancel"
                              onClick={() => setShowConfirmation(false)}
                            >
                              Back
                            </button>
                            <button
                              className="btn-next"
                              onClick={() => setConfirmationStep(2)}
                            >
                              I Understand
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>
                            Please check the box below to confirm project
                            closure:
                          </p>
                          <div className="checkbox-group">
                            <input
                              type="checkbox"
                              id="confirm-closure"
                              defaultChecked={false}
                              onChange={(e) => {
                                // This will be used to enable/disable button
                                document.getElementById(
                                  "btn-final-close"
                                ).disabled = !e.target.checked;
                              }}
                            />
                            <label htmlFor="confirm-closure">
                              I confirm I want to close this project. I
                              understand that I will need to submit a review
                              afterwards.
                            </label>
                          </div>
                          <div className="modal-actions">
                            <button
                              className="btn-cancel"
                              onClick={() => setConfirmationStep(1)}
                              disabled={loading}
                            >
                              Back
                            </button>
                            <button
                              id="btn-final-close"
                              className="btn-confirm"
                              onClick={handleCloseProject}
                              disabled={loading}
                            >
                              {loading ? "Closing..." : "Close Project"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn-close-project"
                    onClick={() => {
                      setShowConfirmation(true);
                      setConfirmationStep(1);
                    }}
                    disabled={loading}
                  >
                    Close Project
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {isClosed && (
          <div className="closing-success">
            <div className="success-icon">✓</div>
            <p>Project has been closed successfully.</p>
            <p className="success-note">
              You can now submit or view the review for this project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectClosing;
