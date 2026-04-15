import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaUserCircle, FaEnvelope, FaPhoneAlt,
  FaMoneyBillWave, FaClipboardList, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import { Clock, FileText } from "lucide-react";

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cp2-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 48px 24px 64px;
  }

  /* ── Page header ── */
  .cp2-page-header {
    text-align: center;
    margin-bottom: 44px;
    animation: fadeDown 0.55s ease both;
  }

  .cp2-eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #2563eb;
    background: rgba(37,99,235,0.1);
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 14px;
  }

  .cp2-page-title {
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px;
    line-height: 1.2;
  }

  .cp2-page-title span {
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cp2-page-sub {
    font-size: 16px;
    color: #64748b;
    margin: 0;
  }

  .cp2-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 1.5px solid #bfdbfe;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 600;
    color: #2563eb;
    margin-top: 16px;
    box-shadow: 0 2px 8px rgba(37,99,235,0.1);
  }

  .cp2-count-dot {
    width: 8px; height: 8px;
    background: #f59e0b;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
  }

  /* ── Grid ── */
  .cp2-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    max-width: 1280px;
    margin: 0 auto;
  }

  /* ── Card ── */
  .cp2-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 4px 20px rgba(37,99,235,0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
    animation: fadeUp 0.5s ease both;
  }

  .cp2-card:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 48px rgba(37,99,235,0.18);
    border-color: #93c5fd;
  }

  .cp2-card:nth-child(1) { animation-delay: 0.05s; }
  .cp2-card:nth-child(2) { animation-delay: 0.10s; }
  .cp2-card:nth-child(3) { animation-delay: 0.15s; }
  .cp2-card:nth-child(4) { animation-delay: 0.20s; }
  .cp2-card:nth-child(5) { animation-delay: 0.25s; }
  .cp2-card:nth-child(6) { animation-delay: 0.30s; }

  /* ── Card top bar ── */
  .cp2-card-top {
    background: linear-gradient(135deg, #1d6fdb 0%, #2563eb 55%, #3b82f6 100%);
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
  }

  .cp2-card-top::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 120px; height: 120px;
    background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
  }

  .cp2-card-top-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin-bottom: 4px;
    position: relative; z-index: 1;
  }

  .cp2-project-title {
    font-size: 17px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    position: relative; z-index: 1;
    line-height: 1.3;
  }

  /* ── Contractor strip ── */
  .cp2-contractor-strip {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: #f8faff;
    border-bottom: 1px solid #e0eaff;
  }

  .cp2-avatar-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3px 12px rgba(37,99,235,0.25);
    font-size: 22px;
    color: white;
  }

  .cp2-contractor-name {
    font-size: 15.5px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 2px;
    text-decoration: none;
    transition: color 0.2s;
  }

  .cp2-contractor-name:hover { color: #2563eb; }

  .cp2-contractor-meta {
    font-size: 12.5px;
    color: #64748b;
    margin: 0 0 1px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* ── Card body ── */
  .cp2-card-body {
    padding: 18px 20px 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cp2-section-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: #2563eb;
    margin: 0 0 10px;
  }

  /* ── Detail row ── */
  .cp2-detail-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 10px;
    transition: background 0.2s;
  }

  .cp2-detail-row:hover { background: #f0f7ff; }

  .cp2-detail-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .cp2-detail-inner { flex: 1; }

  .cp2-detail-key {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #94a3b8;
    display: block;
    margin-bottom: 1px;
  }

  .cp2-detail-val {
    font-size: 14.5px;
    font-weight: 600;
    color: #1e293b;
  }

  /* ── Message block ── */
  .cp2-message {
    margin: 6px 0 0;
    padding: 12px 14px;
    background: #f8fafc;
    border-radius: 10px;
    border-left: 3px solid #93c5fd;
  }

  .cp2-message-label {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #2563eb;
    display: block;
    margin-bottom: 4px;
  }

  .cp2-message-text {
    font-size: 13.5px;
    color: #475569;
    line-height: 1.6;
    margin: 0;
  }

  /* ── Action footer ── */
  .cp2-card-footer {
    padding: 14px 20px 20px;
    border-top: 1px solid #e0eaff;
    display: flex;
    gap: 10px;
  }

  .cp2-btn {
    flex: 1;
    padding: 11px 12px;
    border-radius: 12px;
    border: none;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.25s ease;
  }

  .cp2-btn-shortlist {
    background: linear-gradient(135deg, #16a34a, #22c55e);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
  }

  .cp2-btn-shortlist:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(22,163,74,0.42);
  }

  .cp2-btn-reject {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(220,38,38,0.25);
  }

  .cp2-btn-reject:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(220,38,38,0.38);
  }

  .cp2-btn:active { transform: translateY(0); }

  /* ── Empty state ── */
  .cp2-empty {
    max-width: 480px;
    margin: 0 auto;
    text-align: center;
    padding: 60px 32px;
    background: #ffffff;
    border-radius: 24px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 8px 32px rgba(37,99,235,0.08);
    animation: fadeUp 0.5s ease both;
  }

  .cp2-empty-icon {
    width: 72px; height: 72px;
    background: linear-gradient(135deg, #dbeafe, #eff6ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 32px;
  }

  .cp2-empty-title {
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 10px;
  }

  .cp2-empty-sub {
    font-size: 15px;
    color: #64748b;
    line-height: 1.7;
  }

  /* ── Loader ── */
  .cp2-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 18px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cp2-loader-ring {
    width: 52px; height: 52px;
    border: 4px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .cp2-loader-text {
    font-size: 15px;
    font-weight: 600;
    color: #64748b;
  }

  /* ── Keyframes ── */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.8); }
  }

  @media (max-width: 480px) {
    .cp2-grid { grid-template-columns: 1fr; }
    .cp2-root { padding: 32px 16px 48px; }
  }
`;

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="cp2-detail-row">
    <div className="cp2-detail-icon">
      <Icon size={14} color="#fff" />
    </div>
    <div className="cp2-detail-inner">
      <span className="cp2-detail-key">{label}</span>
      <span className="cp2-detail-val">{value}</span>
    </div>
  </div>
);

const ProposalCard = ({ proposal, onAction }) => (
  <div className="cp2-card">

    {/* Top bar — project title */}
    <div className="cp2-card-top">
      <p className="cp2-card-top-label">Project</p>
      <h3 className="cp2-project-title">{proposal.project?.title || "N/A"}</h3>
    </div>

    {/* Contractor strip */}
    <div className="cp2-contractor-strip">
      <div className="cp2-avatar-circle">
        <FaUserCircle size={26} />
      </div>
      <div>
        <Link
          to={`/contractor/${proposal.contractor?._id}`}
          className="cp2-contractor-name"
        >
          {proposal.contractor?.name || "N/A"}
        </Link>
        <p className="cp2-contractor-meta">
          <FaEnvelope size={11} /> {proposal.contractor?.email || "N/A"}
        </p>
        <p className="cp2-contractor-meta">
          <FaPhoneAlt size={11} /> {proposal.contractor?.phone || "N/A"}
        </p>
      </div>
    </div>

    {/* Proposal details */}
    <div className="cp2-card-body">
      <p className="cp2-section-label">Proposal Details</p>

      <DetailRow
        icon={FaMoneyBillWave}
        label="Proposed Price"
        value={`Rs. ${Number(proposal.price).toLocaleString() || "N/A"}`}
      />
      <DetailRow
        icon={Clock}
        label="Completion Time"
        value={proposal.completionTime || "N/A"}
      />

      {proposal.message && (
        <div className="cp2-message">
          <span className="cp2-message-label">
            <FaClipboardList style={{ marginRight: 5 }} />Message
          </span>
          <p className="cp2-message-text">{proposal.message}</p>
        </div>
      )}
    </div>

    {/* Actions */}
    <div className="cp2-card-footer">
      <button
        className="cp2-btn cp2-btn-shortlist"
        onClick={() => onAction(proposal._id, "accept")}
      >
        <FaCheckCircle size={14} /> Shortlist
      </button>
      <button
        className="cp2-btn cp2-btn-reject"
        onClick={() => onAction(proposal._id, "reject")}
      >
        <FaTimesCircle size={14} /> Reject
      </button>
    </div>

  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export const CustomerProposals = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

 const handleAction = async (id, action) => {
  try {
    const token = localStorage.getItem("customerToken");

    const res = await fetch(`http://localhost:5000/proposals/${id}/${action}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {

      // // 🔥 CHAT CREATE WHEN SHORTLIST (action === accept)
      // if (action === "accept") {
      //   try {
      //     await fetch("http://localhost:5000/chat/room", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${token}`,
      //       },
      //       body: JSON.stringify({
      //         proposalId: id,
      //       }),
      //     });
      //   } catch (err) {
      //     console.error("Chat creation failed:", err);
      //   }
      // }

      Swal.fire({
        icon: "success",
        title: `Proposal ${action}ed successfully!`,
        timer: 1500,
        showConfirmButton: false,
      });

      setProposals((prev) => prev.filter((p) => p._id !== id));

    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: data.error || "Failed to update proposal",
      });
    }

  } catch (err) {
    console.error(err);
  }
};

  const confirmAction = async (id, action) => {
    const actionText = action === "accept" ? "shortlist" : "reject";
    const result = await Swal.fire({
      title: `Are you sure you want to ${actionText} this proposal?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: action === "accept" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (result.isConfirmed) handleAction(id, action);
  };

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        const customerId = customer?._id || customer?.id;
        if (!customerId) { setLoading(false); return; }

        const res = await fetch(`http://localhost:5000/proposals/customer/${customerId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProposals(Array.isArray(data) ? data.filter((p) => p.status === "pending") : []);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    if (customer?._id || customer?.id) fetchProposals();
  }, [customer?._id, customer?.id]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="cp2-loader">
          <div className="cp2-loader-ring" />
          <p className="cp2-loader-text">Loading proposals…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cp2-root">

        {/* Header */}
        <div className="cp2-page-header">
          <span className="cp2-eyebrow">Customer Portal</span>
          <h1 className="cp2-page-title">
            Proposals <span>Received</span>
          </h1>
          <p className="cp2-page-sub">Review and shortlist the best bids for your projects</p>
          {proposals.length > 0 && (
            <div className="cp2-count-badge">
              <span className="cp2-count-dot" />
              {proposals.length} pending {proposals.length === 1 ? "proposal" : "proposals"}
            </div>
          )}
        </div>

        {/* Content */}
        {proposals.length === 0 ? (
          <div className="cp2-empty">
            <div className="cp2-empty-icon">📬</div>
            <h3 className="cp2-empty-title">No Proposals Yet</h3>
            <p className="cp2-empty-sub">
              You haven't received any proposals yet.<br />
              Contractors will reach out once they find your project interesting.
            </p>
          </div>
        ) : (
          <div className="cp2-grid">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal._id}
                proposal={proposal}
                onAction={confirmAction}
              />
            ))}
          </div>
        )}

      </div>
    </>
  );
};