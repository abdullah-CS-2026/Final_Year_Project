import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaMoneyBillWave, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import { Clock, Trophy, ChevronDown } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cap2-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 56px 28px 72px;
  }

  /* ══ Header ══ */
  .cap2-header {
    text-align: center;
    margin-bottom: 52px;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .cap2-eyebrow {
    display: inline-block;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2.8px;
    text-transform: uppercase;
    color: #16a34a;
    background: rgba(22,163,74,0.1);
    border: 1.5px solid rgba(22,163,74,0.25);
    padding: 7px 20px;
    border-radius: 999px;
    margin-bottom: 18px;
  }

  .cap2-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    color: #0a0f1e;
    margin: 0 0 12px;
    line-height: 1.12;
    letter-spacing: -0.6px;
  }

  .cap2-title span {
    background: linear-gradient(135deg, #15803d 20%, #22c55e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cap2-subtitle {
    font-size: 18px;
    color: #475569;
    font-weight: 600;
    margin: 0;
  }

  .cap2-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 2px solid #bbf7d0;
    border-radius: 999px;
    padding: 9px 22px;
    font-size: 16px;
    font-weight: 800;
    color: #16a34a;
    margin-top: 20px;
    box-shadow: 0 3px 16px rgba(22,163,74,0.16);
  }

  .cap2-count-dot {
    width: 11px; height: 11px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  /* ══ Grid ══ */
  .cap2-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 28px;
    max-width: 1300px;
    margin: 0 auto;
  }

  /* ══ Card ══ */
  .cap2-card {
    background: #fff;
    border-radius: 22px;
    border: 1.5px solid #dcfce7;
    box-shadow: 0 6px 24px rgba(22,163,74,0.09);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease, border-color 0.3s ease;
  }

  .cap2-card:hover {
    transform: translateY(-10px) scale(1.015);
    box-shadow: 0 24px 56px rgba(22,163,74,0.2);
    border-color: #86efac;
  }

  .cap2-card:nth-child(1)  { animation-delay: 0.05s; }
  .cap2-card:nth-child(2)  { animation-delay: 0.10s; }
  .cap2-card:nth-child(3)  { animation-delay: 0.15s; }
  .cap2-card:nth-child(4)  { animation-delay: 0.20s; }
  .cap2-card:nth-child(5)  { animation-delay: 0.25s; }
  .cap2-card:nth-child(6)  { animation-delay: 0.30s; }
  .cap2-card:nth-child(7)  { animation-delay: 0.35s; }
  .cap2-card:nth-child(8)  { animation-delay: 0.40s; }
  .cap2-card:nth-child(9)  { animation-delay: 0.45s; }
  .cap2-card:nth-child(10) { animation-delay: 0.50s; }

  /* ══ Banner ══ */
  .cap2-banner {
    background: linear-gradient(135deg, #15803d 0%, #16a34a 55%, #22c55e 100%);
    padding: 22px 24px 20px;
    position: relative;
    overflow: hidden;
  }

  .cap2-banner::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .cap2-banner::after {
    content: '';
    position: absolute;
    bottom: -30px; left: 20px;
    width: 100px; height: 100px;
    background: radial-gradient(circle, rgba(134,239,172,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .cap2-banner-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    margin-bottom: 5px;
    position: relative; z-index: 1;
  }

  .cap2-banner-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    position: relative; z-index: 1;
  }

  .cap2-project-title {
    font-size: 21px;
    font-weight: 800;
    color: #fff;
    margin: 0;
    line-height: 1.3;
    flex: 1;
    text-shadow: 0 1px 6px rgba(0,0,0,0.15);
  }

  .cap2-accepted-pill {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 700;
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

  /* ══ Customer Strip ══ */
  .cap2-customer {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    background: #f0fdf4;
    border-bottom: 1.5px solid #dcfce7;
  }

  .cap2-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #15803d, #22c55e);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #fff;
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
  }

  .cap2-customer-info { flex: 1; }

  .cap2-customer-name {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    display: block;
    margin-bottom: 4px;
  }

  .cap2-meta-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 3px;
  }

  .cap2-meta-icon { color: #86efac; flex-shrink: 0; }

  /* ══ Card Body ══ */
  .cap2-body {
    padding: 20px 24px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cap2-body-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: #16a34a;
    margin-bottom: 10px;
  }

  /* ══ Detail Row ══ */
  .cap2-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 10px 10px;
    border-radius: 12px;
    transition: background 0.2s;
    cursor: default;
  }

  .cap2-row:hover { background: #f0fdf4; }

  .cap2-row-icon {
    width: 46px; height: 46px;
    border-radius: 13px;
    background: linear-gradient(135deg, #15803d, #22c55e);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(22,163,74,0.28);
  }

  .cap2-row-inner { flex: 1; }

  .cap2-row-key {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #94a3b8;
    display: block;
    margin-bottom: 3px;
  }

  .cap2-row-val {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.4;
  }

  /* ══ Message Block ══ */
  .cap2-msg {
    margin: 8px 0 4px;
    padding: 14px 16px;
    background: #f0fdf4;
    border-radius: 12px;
    border-left: 5px solid #86efac;
  }

  .cap2-msg-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #16a34a;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  .cap2-msg-text {
    font-size: 15px;
    font-weight: 600;
    color: #334155;
    line-height: 1.65;
    margin: 0;
  }

  /* ══ Footer ══ */
  .cap2-footer {
    padding: 16px 24px 22px;
    border-top: 1.5px solid #dcfce7;
  }

  .cap2-status-bar {
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

  /* ══ Load More ══ */
  .cap2-load-more-wrap {
    text-align: center;
    margin-top: 40px;
    animation: fadeUp 0.4s ease both;
  }

  .cap2-load-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 36px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #15803d, #22c55e);
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(22,163,74,0.34);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
    letter-spacing: 0.2px;
  }

  .cap2-load-more-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(22,163,74,0.44);
  }

  /* ══ Empty State ══ */
  .cap2-empty {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    padding: 64px 36px;
    background: #fff;
    border-radius: 28px;
    border: 1.5px solid #dcfce7;
    box-shadow: 0 10px 40px rgba(22,163,74,0.08);
    animation: fadeUp 0.55s ease both;
  }

  .cap2-empty-icon {
    width: 88px; height: 88px;
    background: linear-gradient(135deg, #dcfce7, #f0fdf4);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    font-size: 40px;
    box-shadow: 0 4px 16px rgba(22,163,74,0.12);
  }

  .cap2-empty-title {
    font-size: 28px;
    font-weight: 800;
    color: #0a0f1e;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }

  .cap2-empty-text {
    font-size: 17px;
    font-weight: 600;
    color: #64748b;
    line-height: 1.75;
    margin: 0;
  }

  /* ══ Loader ══ */
  .cap2-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cap2-spinner {
    width: 56px; height: 56px;
    border: 5px solid #bbf7d0;
    border-top-color: #16a34a;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  .cap2-loader-text {
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
    .cap2-grid { grid-template-columns: 1fr; gap: 20px; }
    .cap2-root { padding: 36px 16px 56px; }
    .cap2-title { font-size: 28px; }
  }
`;

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="cap2-row">
    <div className="cap2-row-icon">
      <Icon size={21} color="#fff" />
    </div>
    <div className="cap2-row-inner">
      <span className="cap2-row-key">{label}</span>
      <span className="cap2-row-val">{value}</span>
    </div>
  </div>
);

const ProposalCard = ({ proposal }) => (
  <div className="cap2-card">

    {/* Banner */}
    <div className="cap2-banner">
      <p className="cap2-banner-label">Accepted Project</p>
      <div className="cap2-banner-row">
        <h3 className="cap2-project-title">{proposal.project?.title || "N/A"}</h3>
        <span className="cap2-accepted-pill">
          <FaCheckCircle size={12} /> Accepted
        </span>
      </div>
    </div>

    {/* Customer strip */}
    <div className="cap2-customer">
      <div className="cap2-avatar">
        <FaUserCircle size={34} />
      </div>
      <div className="cap2-customer-info">
        <span className="cap2-customer-name">{proposal.customer?.name || "N/A"}</span>
        <div className="cap2-meta-row">
          <FaEnvelope size={14} className="cap2-meta-icon" />
          {proposal.customer?.email || "N/A"}
        </div>
        <div className="cap2-meta-row">
          <FaPhoneAlt size={14} className="cap2-meta-icon" />
          {proposal.customer?.phone || "N/A"}
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="cap2-body">
      <p className="cap2-body-label">Proposal Details</p>
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
        <div className="cap2-msg">
          <div className="cap2-msg-label">
            <FaClipboardList size={13} /> Message
          </div>
          <p className="cap2-msg-text">{proposal.message}</p>
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="cap2-footer">
      <div className="cap2-status-bar">
        <Trophy size={20} />
        Proposal Accepted & Confirmed
      </div>
    </div>

  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const ContractorAcceptedProposals = () => {
  const [contractor,    setContractor]    = useState(null);
  const [proposals,     setProposals]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [visibleCount,  setVisibleCount]  = useState(10);

  useEffect(() => {
    const storedContractor = JSON.parse(localStorage.getItem("contractor"));
    setContractor(storedContractor);
  }, []);

  useEffect(() => {
    if (!contractor) return;

    const fetchAccepted = async () => {
      try {
        const contractorId = contractor._id;
        const res  = await fetch(`${BASE_URL}/contractor/${contractorId}/accepted`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data))              setProposals(data);
        else if (Array.isArray(data.proposals)) setProposals(data.proposals);
        else                                    setProposals([]);
      } catch (error) {
        console.error("Error fetching contractor accepted proposals:", error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccepted();
  }, [contractor]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="cap2-loader">
          <div className="cap2-spinner" />
          <p className="cap2-loader-text">Loading accepted proposals…</p>
        </div>
      </>
    );
  }

  const visible = proposals.slice(0, visibleCount);

  return (
    <>
      <style>{styles}</style>
      <div className="cap2-root">

        {/* Header */}
        <div className="cap2-header">
          <span className="cap2-eyebrow">Contractor Portal</span>
          <h1 className="cap2-title">My Accepted <span>Proposals</span></h1>
          <p className="cap2-subtitle">Projects confirmed by customers — ready to build</p>
          {proposals.length > 0 && (
            <div className="cap2-count-badge">
              <span className="cap2-count-dot" />
              {proposals.length} accepted {proposals.length === 1 ? "proposal" : "proposals"}
            </div>
          )}
        </div>

        {/* Content */}
        {proposals.length === 0 ? (
          <div className="cap2-empty">
            <div className="cap2-empty-icon">🏗️</div>
            <h3 className="cap2-empty-title">No Accepted Proposals Yet</h3>
            <p className="cap2-empty-text">
              You haven't had any proposals accepted by customers yet.<br />
              Keep sending compelling proposals on new projects!
            </p>
          </div>
        ) : (
          <>
            <div className="cap2-grid">
              {visible.map(proposal => (
                <ProposalCard key={proposal._id} proposal={proposal} />
              ))}
            </div>

            {visibleCount < proposals.length && (
              <div className="cap2-load-more-wrap">
                <button
                  className="cap2-load-more-btn"
                  onClick={() => setVisibleCount(prev => prev + 15)}
                >
                  <ChevronDown size={20} />
                  Load More ({proposals.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
};