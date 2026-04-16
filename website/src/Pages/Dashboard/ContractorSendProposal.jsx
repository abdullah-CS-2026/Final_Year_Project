import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { DollarSign, Clock, MessageSquare, Send, ArrowLeft } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .csp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .csp-wrapper {
    width: 100%;
    max-width: 580px;
    animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* ── Back link ── */
  .csp-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 14px;
    font-weight: 600;
    color: #2563eb;
    background: rgba(37,99,235,0.08);
    border: 1px solid rgba(37,99,235,0.15);
    border-radius: 20px;
    padding: 7px 16px;
    margin-bottom: 20px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }
  .csp-back:hover {
    background: rgba(37,99,235,0.15);
    transform: translateX(-3px);
    color: #1d4ed8;
  }

  /* ── Card ── */
  .csp-card {
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(29,111,219,0.15);
    overflow: hidden;
    border: 1.5px solid #e0eaff;
  }

  /* ── Header ── */
  .csp-header {
    background: linear-gradient(135deg, #1d6fdb 0%, #2563eb 55%, #3b82f6 100%);
    padding: 28px 36px 26px;
    position: relative;
    overflow: hidden;
  }

  .csp-header::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%);
  }

  .csp-header::after {
    content: '';
    position: absolute;
    bottom: -35px; left: 24px;
    width: 110px; height: 110px;
    background: radial-gradient(circle, rgba(147,197,253,0.18) 0%, transparent 70%);
  }

  .csp-eyebrow {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    margin-bottom: 5px;
    position: relative; z-index: 1;
  }

  .csp-title {
    font-size: 26px;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    position: relative; z-index: 1;
    line-height: 1.2;
  }

  .csp-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    margin: 6px 0 0;
    position: relative; z-index: 1;
  }

  /* ── Form body ── */
  .csp-body {
    padding: 30px 36px 36px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Field ── */
  .csp-field {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 12px 16px;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .csp-field:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    background: #ffffff;
  }

  .csp-field-textarea {
    align-items: flex-start;
  }

  .csp-icon-tile {
    width: 42px;
    height: 42px;
    border-radius: 11px;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .csp-field-textarea .csp-icon-tile {
    margin-top: 2px;
  }

  .csp-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .csp-label {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 3px;
  }

  .csp-input {
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    padding: 0;
    outline: none;
    width: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .csp-input::placeholder { color: #cbd5e1; font-weight: 400; }

  .csp-textarea {
    border: none;
    background: transparent;
    font-size: 15.5px;
    font-weight: 500;
    color: #1e293b;
    padding: 0;
    outline: none;
    width: 100%;
    resize: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100px;
    line-height: 1.6;
  }

  .csp-textarea::placeholder { color: #cbd5e1; }

  /* ── Divider ── */
  .csp-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e0eaff, transparent);
    margin: 4px 0;
  }

  /* ── Submit button ── */
  .csp-submit {
    width: 100%;
    padding: 15px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #1d6fdb, #3b82f6);
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 5px 18px rgba(37,99,235,0.38);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.25s ease;
    margin-top: 6px;
  }

  .csp-submit:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(37,99,235,0.48);
  }

  .csp-submit:active { transform: translateY(0); }

  .csp-submit-arrow {
    transition: transform 0.2s ease;
  }

  .csp-submit:hover .csp-submit-arrow {
    transform: translateX(4px);
  }

  /* ── Progress indicator ── */
  .csp-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 36px;
    margin-bottom: -8px;
  }

  .csp-progress-step {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
  }

  .csp-progress-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #cbd5e1;
  }

  .csp-progress-dot.active {
    background: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.2);
  }

  .csp-progress-line {
    flex: 1;
    height: 1.5px;
    background: #e2e8f0;
  }

  /* ── Keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 480px) {
    .csp-body { padding: 24px 20px 28px; }
    .csp-header { padding: 24px 20px; }
    .csp-title { font-size: 22px; }
  }
`;

export const ContractorSendProposal = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const contractor = JSON.parse(localStorage.getItem("contractor"));
  const contractorId = location.state?.contractorId || contractor?._id;

  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractorId, projectId, price, message, completionTime }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Proposal sent successfully!");
        setTimeout(() => navigate("/All-pending-projects-list"), 1500);
      } else {
        toast.error(data.error || "Failed to send proposal");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error sending proposal:", error);
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            borderRadius: "12px",
          },
        }}
      />

      <div className="csp-root">
        <div className="csp-wrapper">

          {/* Back button */}
          <span className="csp-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} /> Back to Projects
          </span>

          <div className="csp-card">
            {/* Header */}
            <div className="csp-header">
              <p className="csp-eyebrow">Contractor Portal</p>
              <h2 className="csp-title">Send a Proposal</h2>
              <p className="csp-subtitle">Fill in your offer details below to submit your bid</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="csp-body">

                {/* Price */}
                <div className="csp-field">
                  <div className="csp-icon-tile">
                    <DollarSign size={18} color="#fff" />
                  </div>
                  <div className="csp-inner">
                    <span className="csp-label">Proposed Price (Rs.)</span>
                    <input
                      className="csp-input"
                      type="number"
                      placeholder="e.g. 2,500,000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Completion Time */}
                <div className="csp-field">
                  <div className="csp-icon-tile">
                    <Clock size={18} color="#fff" />
                  </div>
                  <div className="csp-inner">
                    <span className="csp-label">Estimated Completion Time</span>
                    <input
                      className="csp-input"
                      type="text"
                      placeholder="e.g. 15 Days / 2 Months / 1 Year"
                      value={completionTime}
                      onChange={(e) => setCompletionTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="csp-divider" />

                {/* Message */}
                <div className="csp-field csp-field-textarea">
                  <div className="csp-icon-tile">
                    <MessageSquare size={18} color="#fff" />
                  </div>
                  <div className="csp-inner">
                    <span className="csp-label">Cover Message</span>
                    <textarea
                      className="csp-textarea"
                      rows="4"
                      placeholder="Introduce yourself, highlight your experience, and explain why you're the best fit for this project..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="csp-submit" disabled={submitting}>
                  {submitting ? (
                    <>Submitting…</>
                  ) : (
                    <>
                      <Send size={17} />
                      Submit Proposal
                      <span className="csp-submit-arrow">→</span>
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};