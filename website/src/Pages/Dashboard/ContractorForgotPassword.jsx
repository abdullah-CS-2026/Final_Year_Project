import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Hammer, CheckCircle } from "lucide-react";
import { showToast } from "../../components/Toast";

export const ContractorForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/contractor/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      showToast(
        data.message || "If an account exists with this email, you will receive a reset link shortly.",
        "success",
        3000
      );

      // Show success message regardless of whether account exists (for security)
      setSubmitted(true);

      // Redirect after 4 seconds
      setTimeout(() => {
        navigate("/contractor-login");
      }, 4000);
    } catch (err) {
      console.error(err);
      showToast("An error occurred. Please try again.", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
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
              Recover your account and get back to managing your contractor business
            </p>
          </div>

          {/* Forgot Password Card */}
          <div className="col-md-6 col-lg-5">
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                padding: "40px"
              }}
            >
              {!submitted ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-4">
                    <Lock size={40} color="#ff6b6b" className="mb-2" />
                    <h3 className="fw-bold" style={{ color: "#ff6b6b" }}>
                      Forgot Password?
                    </h3>
                    <p className="text-muted small mt-2">
                      No problem! Enter your email and we'll send you a reset link
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">
                        Email Address
                      </label>
                      <div className="d-flex align-items-center bg-light rounded px-3" style={{ border: "2px solid #f0f0f0" }}>
                        <Mail size={18} className="me-2 text-danger" />
                        <input
                          type="email"
                          className="form-control border-0 bg-transparent"
                          placeholder="Enter your registered email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          required
                          disabled={loading}
                        />
                      </div>
                      <small className="text-muted d-block mt-2">
                        We'll send a password reset link to this email
                      </small>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn w-100 fw-bold mb-3"
                      style={{
                        background: loading 
                          ? "#ccc" 
                          : "linear-gradient(135deg,#ff6b6b,#ee5a6f)",
                        color: "white",
                        borderRadius: "10px",
                        padding: "12px",
                        border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease"
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Sending...
                        </span>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <hr className="my-3" />

                  {/* Back to Login */}
                  <button
                    onClick={handleBack}
                    className="btn btn-outline-danger w-100"
                    style={{
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>

                  {/* Info Box */}
                  <div
                    style={{
                      background: "#fff3cd",
                      border: "1px solid #ffc107",
                      borderRadius: "8px",
                      padding: "12px",
                      marginTop: "20px",
                      fontSize: "13px",
                      color: "#856404"
                    }}
                  >
                    <strong>💡 Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
                  </div>
                </>
              ) : (
                <>
                  {/* Success Message */}
                  <div className="text-center">
                    <CheckCircle 
                      size={60} 
                      color="#28a745" 
                      className="mb-3" 
                    />
                    <h4 className="fw-bold mb-3" style={{ color: "#28a745" }}>
                      Check Your Email!
                    </h4>
                    <p className="text-muted mb-4">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="text-muted small mb-4">
                      The link will expire in 15 minutes. If you don't see the email, check your spam folder.
                    </p>

                    <button
                      onClick={() => navigate("/contractor-login")}
                      className="btn w-100 fw-bold"
                      style={{
                        background: "linear-gradient(135deg,#ff6b6b,#ee5a6f)",
                        color: "white",
                        borderRadius: "10px",
                        padding: "12px"
                      }}
                    >
                      Back to Login
                    </button>
                  </div>

                  <div
                    style={{
                      background: "#e8f5e9",
                      border: "1px solid #4caf50",
                      borderRadius: "8px",
                      padding: "12px",
                      marginTop: "20px",
                      fontSize: "13px",
                      color: "#2e7d32"
                    }}
                  >
                    <strong>✓ Next Step:</strong> Click the link in the email to reset your password.
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

