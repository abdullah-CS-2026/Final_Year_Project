import React, { useEffect, useState } from "react";
import {
  FaUserCircle, FaEnvelope, FaPhoneAlt,
  FaMoneyBillWave, FaClipboardList, FaCheckCircle
} from "react-icons/fa";
import { Clock, Trophy } from "lucide-react";

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cap-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 56px 28px 72px;
  }

  /* ══ Page Header ══ */
  .cap-header {
    text-align: center;
    margin-bottom: 52px;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cap-eyebrow {
    display: inline-block;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2.8px;
    text-transform: uppercase;
    color: #16a34a;
    background: rgba(22,163,74,0.1);
    border: 1px solid rgba(22,163,74,0.22);
    padding: 6px 18px;
    border-radius: 999px;
    margin-bottom: 18px;
  }

  .cap-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }

  .cap-title span {
    background: linear-gradient(135deg, #15803d 30%, #22c55e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cap-subtitle {
    font-size: 18px;
    color: #64748b;
    font-weight: 500;
    margin: 0;
  }

  .cap-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #bbf7d0;
    border-radius: 999px;
    padding: 8px 20px;
    font-size: 15px;
    font-weight: 700;
    color: #16a34a;
    margin-top: 20px;
    box-shadow: 0 2px 12px rgba(22,163,74,0.14);
  }

  .cap-badge-dot {
    width: 10px; height: 10px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  /* ══ Grid ══ */
  .cap-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 28px;
    max-width: 1300px;
    margin: 0 auto;
  }

  /* ══ Card ══ */
  .cap-card {
    background: #fff;
    border-radius: 22px;
    border: 1.5px solid #dcfce7;
    box-shadow: 0 6px 24px rgba(22,163,74,0.09);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
  }

  .cap-card:hover {
    transform: translateY(-10px) scale(1.015);
    box-shadow: 0 24px 56px rgba(22,163,74,0.2);
    border-color: #86efac;
  }

  .cap-card:nth-child(1) { animation-delay: 0.06s; }
  .cap-card:nth-child(2) { animation-delay: 0.12s; }
  .cap-card:nth-child(3) { animation-delay: 0.18s; }
  .cap-card:nth-child(4) { animation-delay: 0.24s; }
  .cap-card:nth-child(5) { animation-delay: 0.30s; }
  .cap-card:nth-child(6) { animation-delay: 0.36s; }

  /* ══ Card Banner ══ */
  .cap-banner {
    background: linear-gradient(135deg, #15803d 0%, #16a34a 55%, #22c55e 100%);
    padding: 22px 24px 20px;
    position: relative;
    overflow: hidden;
  }

  .cap-banner::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .cap-banner::after {
    content: '';
    position: absolute;
    bottom: -30px; left: 20px;
    width: 100px; height: 100px;
    background: radial-gradient(circle, rgba(134,239,172,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .cap-banner-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin-bottom: 5px;
    position: relative; z-index: 1;
  }

  .cap-banner-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    position: relative; z-index: 1;
  }

  .cap-project-title {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    margin: 0;
    line-height: 1.3;
    flex: 1;
    padding-right: 8px;
  }

  .cap-accepted-pill {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.2);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.35);
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
  }

  /* ══ Contractor Strip ══ */
  .cap-contractor {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    background: #f0fdf4;
    border-bottom: 1.5px solid #dcfce7;
  }

  .cap-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #15803d, #22c55e);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
    color: #fff;
  }

  .cap-contractor-info { flex: 1; }

  .cap-contractor-name {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    display: block;
    margin-bottom: 4px;
  }

  .cap-meta-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 3px;
  }

  .cap-meta-icon { color: #86efac; flex-shrink: 0; }

  /* ══ Card Body ══ */
  .cap-body {
    padding: 20px 24px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cap-body-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #16a34a;
    margin-bottom: 8px;
  }

  /* ══ Detail Row ══ */
  .cap-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 10px 12px;
    border-radius: 12px;
    transition: background 0.2s;
    cursor: default;
  }

  .cap-row:hover { background: #f0fdf4; }

  .cap-row-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #15803d, #22c55e);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3px 8px rgba(22,163,74,0.25);
  }

  .cap-row-inner { flex: 1; }

  .cap-row-key {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #94a3b8;
    display: block;
    margin-bottom: 2px;
  }

  .cap-row-val {
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.3;
  }

  /* ══ Message Block ══ */
  .cap-msg {
    margin: 8px 0 4px;
    padding: 14px 16px;
    background: #f0fdf4;
    border-radius: 12px;
    border-left: 4px solid #86efac;
  }

  .cap-msg-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #16a34a;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  .cap-msg-text {
    font-size: 15px;
    font-weight: 500;
    color: #475569;
    line-height: 1.65;
    margin: 0;
  }

  /* ══ Footer ══ */
  .cap-footer {
    padding: 16px 24px 22px;
    border-top: 1.5px solid #dcfce7;
  }

  .cap-status-bar {
    width: 100%;
    padding: 14px 16px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: linear-gradient(135deg, rgba(21,128,61,0.08), rgba(34,197,94,0.12));
    color: #15803d;
    border: 2px solid rgba(21,128,61,0.2);
    letter-spacing: 0.3px;
  }

  /* ══ Empty State ══ */
  .cap-empty {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    padding: 64px 36px;
    background: #fff;
    border-radius: 28px;
    border: 1.5px solid #dcfce7;
    box-shadow: 0 10px 40px rgba(22,163,74,0.1);
    animation: fadeUp 0.55s ease both;
  }

  .cap-empty-icon {
    width: 84px; height: 84px;
    background: linear-gradient(135deg, #dcfce7, #f0fdf4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 38px;
    box-shadow: 0 4px 16px rgba(22,163,74,0.14);
  }

  .cap-empty-title {
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }

  .cap-empty-text {
    font-size: 17px;
    font-weight: 500;
    color: #64748b;
    line-height: 1.75;
    margin: 0;
  }

  /* ══ Loader ══ */
  .cap-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cap-spinner {
    width: 56px; height: 56px;
    border: 5px solid #bbf7d0;
    border-top-color: #16a34a;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  .cap-loader-text {
    font-size: 17px;
    font-weight: 600;
    color: #64748b;
  }

  /* ══ Keyframes ══ */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.72); }
  }

  @media (max-width: 520px) {
    .cap-grid { grid-template-columns: 1fr; gap: 20px; }
    .cap-root { padding: 36px 16px 56px; }
    .cap-title { font-size: 28px; }
  }
`;

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="cap-row">
    <div className="cap-row-icon">
      <Icon size={20} color="#fff" />
    </div>
    <div className="cap-row-inner">
      <span className="cap-row-key">{label}</span>
      <span className="cap-row-val">{value}</span>
    </div>
  </div>
);

const ProposalCard = ({ proposal }) => (
  <div className="cap-card">

    {/* Banner */}
    <div className="cap-banner">
      <p className="cap-banner-label">Accepted Project</p>
      <div className="cap-banner-row">
        <h3 className="cap-project-title">{proposal.project?.title || "N/A"}</h3>
        <span className="cap-accepted-pill">
          <FaCheckCircle size={12} /> Accepted
        </span>
      </div>
    </div>

    {/* Contractor strip */}
    <div className="cap-contractor">
      <div className="cap-avatar">
        <FaUserCircle size={34} />
      </div>
      <div className="cap-contractor-info">
        <span className="cap-contractor-name">{proposal.contractor?.name || "N/A"}</span>
        <div className="cap-meta-row">
          <FaEnvelope size={14} className="cap-meta-icon" />
          {proposal.contractor?.email || "N/A"}
        </div>
        <div className="cap-meta-row">
          <FaPhoneAlt size={14} className="cap-meta-icon" />
          {proposal.contractor?.phone || "N/A"}
        </div>
      </div>
    </div>

    {/* Proposal details */}
    <div className="cap-body">
      <p className="cap-body-label">Proposal Details</p>
      <DetailRow
        icon={FaMoneyBillWave}
        label="Agreed Price"
        value={`Rs. ${Number(proposal.price).toLocaleString() || "N/A"}`}
      />
      <DetailRow
        icon={Clock}
        label="Completion Time"
        value={proposal.completionTime || "N/A"}
      />
      {proposal.message && (
        <div className="cap-msg">
          <div className="cap-msg-label">
            <FaClipboardList size={13} /> Message
          </div>
          <p className="cap-msg-text">{proposal.message}</p>
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="cap-footer">
      <div className="cap-status-bar">
        <Trophy size={20} />
        Project Accepted & Confirmed
      </div>
    </div>

  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const CustomerAcceptedProposals = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const token      = localStorage.getItem("customerToken");
        const customerId = customer?._id || customer?.id;
        if (!customerId) { setLoading(false); return; }

        const res  = await fetch(`http://localhost:5000/proposals/customer/${customerId}/accepted`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProposals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching accepted proposals:", err);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    if (customer?._id || customer?.id) fetchAccepted();
  }, [customer?._id, customer?.id]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="cap-loader">
          <div className="cap-spinner" />
          <p className="cap-loader-text">Loading accepted proposals…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cap-root">

        {/* Header */}
        <div className="cap-header">
          <span className="cap-eyebrow">Customer Portal</span>
          <h1 className="cap-title">My Accepted <span>Proposals</span></h1>
          <p className="cap-subtitle">Your confirmed contractors and ongoing project agreements</p>
          {proposals.length > 0 && (
            <div className="cap-badge">
              <span className="cap-badge-dot" />
              {proposals.length} accepted {proposals.length === 1 ? "proposal" : "proposals"}
            </div>
          )}
        </div>

        {/* Content */}
        {proposals.length === 0 ? (
          <div className="cap-empty">
            <div className="cap-empty-icon">🏗️</div>
            <h3 className="cap-empty-title">No Accepted Proposals</h3>
            <p className="cap-empty-text">
              You don't have any accepted proposals yet.<br />
              Start by creating a new project request and reviewing contractor bids.
            </p>
          </div>
        ) : (
          <div className="cap-grid">
            {proposals.map(proposal => (
              <ProposalCard key={proposal._id} proposal={proposal} />
            ))}
          </div>
        )}

      </div>
    </>
  );
};