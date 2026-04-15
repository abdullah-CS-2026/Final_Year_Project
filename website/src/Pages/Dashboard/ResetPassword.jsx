import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Hammer } from "lucide-react";
import { showToast } from "../../components/Toast";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`http://localhost:5000/contractor/verify-reset-token/${token}`);
        const data = await res.json();

        if (data.valid) {
          setTokenValid(true);
        } else {
          setError(data.message || "Invalid or expired reset link");
          setTokenValid(false);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while verifying the link");
        setTokenValid(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      showToast("Passwords do not match", "error", 2000);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      showToast("Password must be at least 6 characters long", "error", 2000);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`http://localhost:5000/contractor/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        showToast("Password reset successful!", "success", 2000);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/contractor-login");
        }, 3000);
      } else {
        setError(data.message || "An error occurred");
        showToast(data.message || "An error occurred", "error", 2000);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
      showToast("An error occurred. Please try again later.", "error", 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/contractor-login");
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg,#ff6b6b,#ee5a6f)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          {/* Left Info Section */}
          <div className="col-md-6 d-none d-md-flex flex-column text-white pe-5">
            <Hammer size={80} className="mb-4" />
            <h2 className="fw-bold mb-3">Smart Build</h2>
            <p className="fs-5">
              Create a strong password to secure your contractor account
            </p>
          </div>

          {/* Reset Password Card */}
          <div className="col-md-6 col-lg-5">
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                padding: "40px"
              }}
            >
              {loading ? (
                // Loading state
                <div className="text-center">
                  <div className="spinner-border text-danger mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Verifying reset link...</p>
                </div>
              ) : !tokenValid ? (
                // Invalid token state
                <div className="text-center">
                  <AlertCircle size={60} color="#dc3545" className="mb-3" />
                  <h4 className="fw-bold mb-3" style={{ color: "#dc3545" }}>
                    Invalid or Expired Link
                  </h4>
                  <p className="text-muted mb-4">
                    {error}
                  </p>
                  <button
                    onClick={handleBackToLogin}
                    className="btn w-100 fw-bold"
                    style={{
                      background: "linear-gradient(135deg,#ff6b6b,#ee5a6f)",
                      color: "white",
                      borderRadius: "10px"
                    }}
                  >
                    Request New Link
                  </button>
                </div>
              ) : success ? (
                // Success state
                <div className="text-center">
                  <CheckCircle size={60} color="#28a745" className="mb-3" />
                  <h4 className="fw-bold mb-3" style={{ color: "#28a745" }}>
                    Password Reset Successful!
                  </h4>
                  <p className="text-muted mb-4">
                    Your password has been updated. You can now login with your new password.
                  </p>
                  <button
                    onClick={handleBackToLogin}
                    className="btn w-100 fw-bold"
                    style={{
                      background: "linear-gradient(135deg,#ff6b6b,#ee5a6f)",
                      color: "white",
                      borderRadius: "10px"
                    }}
                  >
                    Go to Login
                  </button>
                </div>
              ) : (
                // Reset form
                <>
                  {/* Header */}
                  <div className="text-center mb-4">
                    <Lock size={40} color="#ff6b6b" className="mb-2" />
                    <h3 className="fw-bold" style={{ color: "#ff6b6b" }}>
                      Reset Password
                    </h3>
                    <p className="text-muted small mt-2">
                      Enter your new password below
                    </p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div
                      style={{
                        background: "#fee",
                        color: "#c33",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontSize: "14px"
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">
                        New Password
                      </label>
                      <div className="d-flex align-items-center bg-light rounded px-3" style={{ border: "2px solid #f0f0f0" }}>
                        <Lock size={18} className="me-2 text-danger" />
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control border-0 bg-transparent flex-grow-1"
                          placeholder="Enter new password (min 6 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                          required
                          disabled={submitting}
                        />
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <small className="text-muted d-block mt-2">
                        Use a mix of uppercase, lowercase, numbers, and symbols
                      </small>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">
                        Confirm Password
                      </label>
                      <div className="d-flex align-items-center bg-light rounded px-3" style={{ border: "2px solid #f0f0f0" }}>
                        <Lock size={18} className="me-2 text-danger" />
                        <input
                          type={showConfirm ? "text" : "password"}
                          className="form-control border-0 bg-transparent flex-grow-1"
                          placeholder="Confirm your new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          autoComplete="new-password"
                          required
                          disabled={submitting}
                        />
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          onClick={() => setShowConfirm(!showConfirm)}
                          style={{ cursor: "pointer" }}
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Password Match Indicator */}
                    {newPassword && confirmPassword && (
                      <div className="mb-4">
                        {newPassword === confirmPassword ? (
                          <small style={{ color: "#28a745" }}>
                            ✓ Passwords match
                          </small>
                        ) : (
                          <small style={{ color: "#dc3545" }}>
                            ✗ Passwords do not match
                          </small>
                        )}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn w-100 fw-bold mb-3"
                      style={{
                        background: 
                          submitting 
                            ? "#ccc" 
                            : "linear-gradient(135deg,#ff6b6b,#ee5a6f)",
                        color: "white",
                        borderRadius: "10px",
                        padding: "12px",
                        border: "none",
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease"
                      }}
                      disabled={submitting || newPassword !== confirmPassword}
                    >
                      {submitting ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Resetting...
                        </span>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </form>

                  {/* Info Box */}
                  <div
                    style={{
                      background: "#e3f2fd",
                      border: "1px solid #2196f3",
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "13px",
                      color: "#1565c0"
                    }}
                  >
                    <strong>💡 Security Tip:</strong> Use a strong password with uppercase, lowercase, numbers, and symbols.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
