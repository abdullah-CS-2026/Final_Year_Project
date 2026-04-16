import React, { useEffect, useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";
import { Clock, CalendarDays, MapPin } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;
/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cssp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 56px 28px 72px;
  }

  /* ══ Header ══ */
  .cssp-header {
    text-align: center;
    margin-bottom: 52px;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cssp-eyebrow {
    display: inline-block;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2.8px;
    text-transform: uppercase;
    color: #1d4ed8;
    background: rgba(37,99,235,0.1);
    border: 1.5px solid rgba(37,99,235,0.25);
    padding: 7px 20px;
    border-radius: 999px;
    margin-bottom: 18px;
  }

  .cssp-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    color: #0a0f1e;
    margin: 0 0 12px;
    line-height: 1.12;
    letter-spacing: -0.6px;
  }

  .cssp-title span {
    background: linear-gradient(135deg, #1d4ed8 20%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cssp-subtitle {
    font-size: 18px;
    color: #475569;
    font-weight: 600;
    margin: 0;
  }

  .cssp-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 2px solid #bfdbfe;
    border-radius: 999px;
    padding: 9px 22px;
    font-size: 16px;
    font-weight: 800;
    color: #1d4ed8;
    margin-top: 20px;
    box-shadow: 0 3px 16px rgba(37,99,235,0.14);
  }

  .cssp-count-dot {
    width: 11px; height: 11px;
    background: #2563eb;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  /* ══ Grid ══ */
  .cssp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 28px;
    max-width: 1300px;
    margin: 0 auto;
  }

  /* ══ Card ══ */
  .cssp-card {
    background: #fff;
    border-radius: 22px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 6px 24px rgba(37,99,235,0.09);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease, border-color 0.3s ease;
  }

  .cssp-card:hover {
    transform: translateY(-10px) scale(1.015);
    box-shadow: 0 24px 56px rgba(37,99,235,0.18);
    border-color: #93c5fd;
  }

  .cssp-card:nth-child(1)  { animation-delay: 0.05s; }
  .cssp-card:nth-child(2)  { animation-delay: 0.10s; }
  .cssp-card:nth-child(3)  { animation-delay: 0.15s; }
  .cssp-card:nth-child(4)  { animation-delay: 0.20s; }
  .cssp-card:nth-child(5)  { animation-delay: 0.25s; }
  .cssp-card:nth-child(6)  { animation-delay: 0.30s; }
  .cssp-card:nth-child(7)  { animation-delay: 0.35s; }
  .cssp-card:nth-child(8)  { animation-delay: 0.40s; }
  .cssp-card:nth-child(9)  { animation-delay: 0.45s; }

  /* ══ Banner ══ */
  .cssp-banner {
    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #3b82f6 100%);
    padding: 22px 24px 20px;
    position: relative;
    overflow: hidden;
  }

  .cssp-banner::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .cssp-banner::after {
    content: '';
    position: absolute;
    bottom: -30px; left: 20px;
    width: 100px; height: 100px;
    background: radial-gradient(circle, rgba(147,197,253,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .cssp-banner-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    position: relative; z-index: 1;
    margin-bottom: 8px;
  }

  .cssp-banner-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    position: relative; z-index: 1;
    margin-bottom: 5px;
  }

  .cssp-project-title {
    font-size: 21px;
    font-weight: 800;
    color: #fff;
    margin: 0;
    line-height: 1.3;
    flex: 1;
    text-shadow: 0 1px 6px rgba(0,0,0,0.15);
  }

  /* Status pill — dynamic colour */
  .cssp-status-pill {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 5px 13px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
    white-space: nowrap;
  }

  .cssp-status-pill.pending     { background: rgba(251,191,36,0.22); color: #fbbf24; border: 1px solid rgba(251,191,36,0.4); }
  .cssp-status-pill.shortlisted { background: rgba(96,165,250,0.22); color: #93c5fd; border: 1px solid rgba(96,165,250,0.4); }
  .cssp-status-pill.accepted    { background: rgba(34,197,94,0.2);   color: #4ade80; border: 1px solid rgba(34,197,94,0.35); }
  .cssp-status-pill.rejected    { background: rgba(248,113,113,0.2); color: #fca5a5; border: 1px solid rgba(248,113,113,0.35); }

  .cssp-location-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.65);
    position: relative; z-index: 1;
    margin-top: 6px;
  }

  /* ══ Customer Strip ══ */
  .cssp-customer {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    background: #f5f9ff;
    border-bottom: 1.5px solid #e0eaff;
  }

  .cssp-avatar {
    width: 62px; height: 62px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid #bfdbfe;
    box-shadow: 0 3px 12px rgba(37,99,235,0.18);
    flex-shrink: 0;
    display: block;
  }

  .cssp-avatar-fallback {
    width: 62px; height: 62px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1d4ed8, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #fff;
    box-shadow: 0 3px 12px rgba(37,99,235,0.22);
  }

  .cssp-customer-info { flex: 1; }

  .cssp-customer-name {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    display: block;
    margin-bottom: 4px;
  }

  .cssp-meta-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 3px;
  }

  .cssp-meta-icon { color: #93c5fd; flex-shrink: 0; }

  /* ══ Body ══ */
  .cssp-body {
    padding: 20px 24px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cssp-body-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: #1d4ed8;
    margin-bottom: 10px;
  }

  /* ══ Detail Row ══ */
  .cssp-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 10px 10px;
    border-radius: 12px;
    transition: background 0.2s;
    cursor: default;
  }

  .cssp-row:hover { background: #eef4ff; }

  .cssp-row-icon {
    width: 46px; height: 46px;
    border-radius: 13px;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(29,78,216,0.28);
  }

  .cssp-row-inner { flex: 1; }

  .cssp-row-key {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #94a3b8;
    display: block;
    margin-bottom: 3px;
  }

  .cssp-row-val {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.4;
  }

  /* ══ Message block ══ */
  .cssp-msg {
    margin: 8px 0 4px;
    padding: 14px 16px;
    background: #eef4ff;
    border-radius: 12px;
    border-left: 5px solid #93c5fd;
  }

  .cssp-msg-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #1d4ed8;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  .cssp-msg-text {
    font-size: 15px;
    font-weight: 600;
    color: #334155;
    line-height: 1.65;
    margin: 0;
  }

  /* ══ Footer ══ */
  .cssp-footer {
    padding: 14px 24px 20px;
    border-top: 1.5px solid #e0eaff;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #64748b;
  }

  .cssp-footer-icon {
    width: 32px; height: 32px;
    border-radius: 9px;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ══ Empty State ══ */
  .cssp-empty {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    padding: 64px 36px;
    background: #fff;
    border-radius: 28px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 10px 40px rgba(37,99,235,0.08);
    animation: fadeUp 0.55s ease both;
  }

  .cssp-empty-icon {
    width: 88px; height: 88px;
    background: linear-gradient(135deg, #dbeafe, #eff6ff);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    font-size: 40px;
    box-shadow: 0 4px 16px rgba(37,99,235,0.1);
  }

  .cssp-empty-title {
    font-size: 28px;
    font-weight: 800;
    color: #0a0f1e;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }

  .cssp-empty-text {
    font-size: 17px;
    font-weight: 600;
    color: #64748b;
    line-height: 1.75;
    margin: 0;
  }

  /* ══ Loader ══ */
  .cssp-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cssp-spinner {
    width: 56px; height: 56px;
    border: 5px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  .cssp-loader-text {
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
    .cssp-grid { grid-template-columns: 1fr; gap: 20px; }
    .cssp-root { padding: 36px 16px 56px; }
    .cssp-title { font-size: 28px; }
  }
`;

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
const statusPillClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "pending")     return "pending";
  if (s === "shortlisted") return "shortlisted";
  if (s === "accepted")    return "accepted";
  if (s === "rejected")    return "rejected";
  return "pending";
};

const statusEmoji = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "pending")     return "⏳";
  if (s === "shortlisted") return "📌";
  if (s === "accepted")    return "✅";
  if (s === "rejected")    return "❌";
  return "⏳";
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="cssp-row">
    <div className="cssp-row-icon">
      <Icon size={21} color="#fff" />
    </div>
    <div className="cssp-row-inner">
      <span className="cssp-row-key">{label}</span>
      <span className="cssp-row-val">{value}</span>
    </div>
  </div>
);

const CustomerAvatar = ({ src, name }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="cssp-avatar-fallback">
        <FaUser size={28} />
      </div>
    );
  }
  return <img className="cssp-avatar" src={src} alt={name} onError={() => setErr(true)} />;
};

const ProposalCard = ({ proposal }) => (
  <div className="cssp-card">

    {/* Banner */}
    <div className="cssp-banner">
      <p className="cssp-banner-label">Sent Proposal</p>
      <div className="cssp-banner-top">
        <h3 className="cssp-project-title">{proposal.project?.title || "N/A"}</h3>
        <span className={`cssp-status-pill ${statusPillClass(proposal.status)}`}>
          {statusEmoji(proposal.status)} {proposal.status?.toUpperCase()}
        </span>
      </div>
      {proposal.project?.location && (
        <div className="cssp-location-row">
          <MapPin size={13} />
          {proposal.project.location}
        </div>
      )}
    </div>

    {/* Customer strip */}
    <div className="cssp-customer">
      <CustomerAvatar
        src={proposal.customer?.profilePic
          ? `${BASE_URL}${proposal.customer.profilePic}`
          : null}
        name={proposal.customer?.name}
      />
      <div className="cssp-customer-info">
        <span className="cssp-customer-name">{proposal.customer?.name || "N/A"}</span>
        <div className="cssp-meta-row">
          <FaEnvelope size={13} className="cssp-meta-icon" />
          {proposal.customer?.email || "N/A"}
        </div>
        <div className="cssp-meta-row">
          <FaPhone size={13} className="cssp-meta-icon" />
          {proposal.customer?.phone || "N/A"}
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="cssp-body">
      <p className="cssp-body-label">Proposal Details</p>
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
        <div className="cssp-msg">
          <div className="cssp-msg-label">
            <FaClipboardList size={13} /> Message
          </div>
          <p className="cssp-msg-text">{proposal.message}</p>
        </div>
      )}
    </div>

    {/* Footer — sent date */}
    <div className="cssp-footer">
      <div className="cssp-footer-icon">
        <CalendarDays size={16} color="#fff" />
      </div>
      Sent on {new Date(proposal.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric"
      })}
    </div>

  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const ContractorSeeSentProposals = () => {
  const contractor   = JSON.parse(localStorage.getItem("contractor"));
  const contractorId = contractor?._id || contractor?.id;

  const [proposals, setProposals] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/proposals/contractor/${contractorId}`);
        const data = await res.json();
        setProposals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching proposals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [contractorId]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="cssp-loader">
          <div className="cssp-spinner" />
          <p className="cssp-loader-text">Loading your proposals…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cssp-root">

        {/* Header */}
        <div className="cssp-header">
          <span className="cssp-eyebrow">Contractor Portal</span>
          <h1 className="cssp-title">My Sent <span>Proposals</span></h1>
          <p className="cssp-subtitle">Track the status of all proposals you've submitted</p>
          {proposals.length > 0 && (
            <div className="cssp-count-badge">
              <span className="cssp-count-dot" />
              {proposals.length} {proposals.length === 1 ? "proposal" : "proposals"} sent
            </div>
          )}
        </div>

        {/* Content */}
        {proposals.length === 0 ? (
          <div className="cssp-empty">
            <div className="cssp-empty-icon">📤</div>
            <h3 className="cssp-empty-title">No Proposals Sent Yet</h3>
            <p className="cssp-empty-text">
              You haven't sent any proposals yet.<br />
              Browse open projects and start bidding!
            </p>
          </div>
        ) : (
          <div className="cssp-grid">
            {proposals.map(proposal => (
              <ProposalCard key={proposal._id} proposal={proposal} />
            ))}
          </div>
        )}

      </div>
    </>
  );
};