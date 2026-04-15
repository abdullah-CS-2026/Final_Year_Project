import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaUserCircle, FaEnvelope, FaPhoneAlt,
  FaMoneyBillWave, FaClipboardList, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .sl-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 56px 28px 72px;
  }

  /* ══ Page Header ══ */
  .sl-header {
    text-align: center;
    margin-bottom: 52px;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .sl-eyebrow {
    display: inline-block;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2.8px;
    text-transform: uppercase;
    color: #2563eb;
    background: rgba(37,99,235,0.1);
    border: 1px solid rgba(37,99,235,0.2);
    padding: 6px 18px;
    border-radius: 999px;
    margin-bottom: 18px;
  }

  .sl-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }

  .sl-title span {
    background: linear-gradient(135deg, #2563eb 30%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sl-subtitle {
    font-size: 18px;
    color: #64748b;
    font-weight: 500;
    margin: 0;
  }

  .sl-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #bfdbfe;
    border-radius: 999px;
    padding: 8px 20px;
    font-size: 15px;
    font-weight: 700;
    color: #2563eb;
    margin-top: 20px;
    box-shadow: 0 2px 12px rgba(37,99,235,0.12);
  }

  .sl-badge-dot {
    width: 10px; height: 10px;
    background: #f59e0b;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  /* ══ Grid ══ */
  .sl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 28px;
    max-width: 1300px;
    margin: 0 auto;
  }

  /* ══ Card ══ */
  .sl-card {
    background: #fff;
    border-radius: 22px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 6px 24px rgba(37,99,235,0.09);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
  }

  .sl-card:hover {
    transform: translateY(-10px) scale(1.015);
    box-shadow: 0 24px 56px rgba(37,99,235,0.2);
    border-color: #93c5fd;
  }

  .sl-card:nth-child(1) { animation-delay: 0.06s; }
  .sl-card:nth-child(2) { animation-delay: 0.12s; }
  .sl-card:nth-child(3) { animation-delay: 0.18s; }
  .sl-card:nth-child(4) { animation-delay: 0.24s; }
  .sl-card:nth-child(5) { animation-delay: 0.30s; }
  .sl-card:nth-child(6) { animation-delay: 0.36s; }

  /* ══ Card Top Banner ══ */
  .sl-card-banner {
    background: linear-gradient(135deg, #1b5ec7 0%, #2563eb 55%, #3b82f6 100%);
    padding: 22px 24px 20px;
    position: relative;
    overflow: hidden;
  }

  .sl-card-banner::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 70%);
    pointer-events: none;
  }

  .sl-card-banner::after {
    content: '';
    position: absolute;
    bottom: -30px; left: 20px;
    width: 100px; height: 100px;
    background: radial-gradient(circle, rgba(147,197,253,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .sl-banner-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    position: relative; z-index: 1;
  }

  .sl-banner-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin-bottom: 5px;
  }

  .sl-project-title {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    margin: 0;
    line-height: 1.3;
    flex: 1;
    padding-right: 8px;
  }

  .sl-status-pill {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    margin-top: 2px;
  }

  .sl-pill-shortlisted {
    background: rgba(245,158,11,0.22);
    color: #fcd34d;
    border: 1px solid rgba(245,158,11,0.45);
  }

  .sl-pill-accepted {
    background: rgba(34,197,94,0.22);
    color: #86efac;
    border: 1px solid rgba(34,197,94,0.45);
  }

  .sl-pill-rejected {
    background: rgba(239,68,68,0.22);
    color: #fca5a5;
    border: 1px solid rgba(239,68,68,0.45);
  }

  /* ══ Contractor Strip ══ */
  .sl-contractor {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    background: #f7faff;
    border-bottom: 1.5px solid #e8efff;
  }

  .sl-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(37,99,235,0.28);
    color: #fff;
  }

  .sl-contractor-info { flex: 1; }

  .sl-contractor-name {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    text-decoration: none;
    display: block;
    margin-bottom: 4px;
    transition: color 0.2s;
  }

  .sl-contractor-name:hover { color: #2563eb; }

  .sl-meta-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 3px;
  }

  .sl-meta-icon { color: #93c5fd; flex-shrink: 0; }

  /* ══ Card Body ══ */
  .sl-body {
    padding: 20px 24px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sl-body-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #2563eb;
    margin-bottom: 8px;
  }

  /* ══ Detail Row ══ */
  .sl-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 10px 12px;
    border-radius: 12px;
    transition: background 0.2s;
    cursor: default;
  }

  .sl-row:hover { background: #f0f7ff; }

  .sl-row-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2563eb, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3px 8px rgba(37,99,235,0.22);
  }

  .sl-row-inner { flex: 1; }

  .sl-row-key {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #94a3b8;
    display: block;
    margin-bottom: 2px;
  }

  .sl-row-val {
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.3;
  }

  /* ══ Message Block ══ */
  .sl-msg {
    margin: 8px 0 4px;
    padding: 14px 16px;
    background: #f8fafc;
    border-radius: 12px;
    border-left: 4px solid #60a5fa;
  }

  .sl-msg-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #2563eb;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  .sl-msg-text {
    font-size: 15px;
    font-weight: 500;
    color: #475569;
    line-height: 1.65;
    margin: 0;
  }

  /* ══ Footer ══ */
  .sl-footer {
    padding: 16px 24px 22px;
    border-top: 1.5px solid #e8efff;
    display: flex;
    gap: 12px;
  }

  .sl-btn {
    flex: 1;
    padding: 14px 16px;
    border-radius: 14px;
    border: none;
    font-size: 16px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.25s ease;
  }

  .sl-btn-accept {
    background: linear-gradient(135deg, #15803d, #22c55e);
    color: #fff;
    box-shadow: 0 5px 16px rgba(21,128,61,0.32);
  }

  .sl-btn-accept:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 26px rgba(21,128,61,0.44);
  }

  .sl-btn-reject {
    background: linear-gradient(135deg, #b91c1c, #ef4444);
    color: #fff;
    box-shadow: 0 5px 16px rgba(185,28,28,0.28);
  }

  .sl-btn-reject:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 26px rgba(185,28,28,0.4);
  }

  .sl-btn:active { transform: translateY(0); }

  .sl-final {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
  }

  .sl-final-accepted {
    background: rgba(21,128,61,0.08);
    color: #15803d;
    border: 2px solid rgba(21,128,61,0.2);
  }

  .sl-final-rejected {
    background: rgba(185,28,28,0.07);
    color: #b91c1c;
    border: 2px solid rgba(185,28,28,0.18);
  }

  /* ══ Empty State ══ */
  .sl-empty {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    padding: 64px 36px;
    background: #fff;
    border-radius: 28px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 10px 40px rgba(37,99,235,0.1);
    animation: fadeUp 0.55s ease both;
  }

  .sl-empty-icon {
    width: 84px; height: 84px;
    background: linear-gradient(135deg, #dbeafe, #eff6ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 38px;
    box-shadow: 0 4px 16px rgba(37,99,235,0.12);
  }

  .sl-empty-title {
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }

  .sl-empty-text {
    font-size: 17px;
    font-weight: 500;
    color: #64748b;
    line-height: 1.75;
    margin: 0;
  }

  /* ══ Loader ══ */
  .sl-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .sl-spinner {
    width: 56px; height: 56px;
    border: 5px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  .sl-loader-text {
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
    50%       { opacity: 0.45; transform: scale(0.75); }
  }

  @media (max-width: 520px) {
    .sl-grid { grid-template-columns: 1fr; gap: 20px; }
    .sl-root { padding: 36px 16px 56px; }
    .sl-title { font-size: 28px; }
  }
`;

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="sl-row">
    <div className="sl-row-icon">
      <Icon size={20} color="#fff" />
    </div>
    <div className="sl-row-inner">
      <span className="sl-row-key">{label}</span>
      <span className="sl-row-val">{value}</span>
    </div>
  </div>
);

const statusMap = {
  shortlisted: { label: "⭐ Shortlisted", cls: "sl-pill-shortlisted" },
  accepted:    { label: "✓ Accepted",    cls: "sl-pill-accepted"    },
  rejected:    { label: "✕ Rejected",    cls: "sl-pill-rejected"    },
};

const ProposalCard = ({ proposal, onAction }) => {
  const status     = proposal.status || "shortlisted";
  const statusInfo = statusMap[status] || statusMap.shortlisted;

  return (
    <div className="sl-card">
      {/* Banner */}
      <div className="sl-card-banner">
        <p className="sl-banner-label">Project</p>
        <div className="sl-banner-row">
          <h3 className="sl-project-title">{proposal.project?.title || "N/A"}</h3>
          <span className={`sl-status-pill ${statusInfo.cls}`}>{statusInfo.label}</span>
        </div>
      </div>

      {/* Contractor */}
      <div className="sl-contractor">
        <div className="sl-avatar"><FaUserCircle size={34} /></div>
        <div className="sl-contractor-info">
          <Link to={`/contractor/${proposal.contractor?._id}`} className="sl-contractor-name">
            {proposal.contractor?.name || "N/A"}
          </Link>
          <div className="sl-meta-row"><FaEnvelope size={14} className="sl-meta-icon" />{proposal.contractor?.email || "N/A"}</div>
          <div className="sl-meta-row"><FaPhoneAlt size={14} className="sl-meta-icon" />{proposal.contractor?.phone || "N/A"}</div>
        </div>
      </div>

      {/* Details */}
      <div className="sl-body">
        <p className="sl-body-label">Proposal Details</p>
        <DetailRow icon={FaMoneyBillWave} label="Proposed Price"   value={`Rs. ${Number(proposal.price).toLocaleString() || "N/A"}`} />
        <DetailRow icon={Clock}           label="Completion Time"  value={proposal.completionTime || "N/A"} />
        {proposal.message && (
          <div className="sl-msg">
            <div className="sl-msg-label"><FaClipboardList size={13} /> Message</div>
            <p className="sl-msg-text">{proposal.message}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sl-footer">
        {status === "shortlisted" && (
          <>
            <button className="sl-btn sl-btn-accept" onClick={() => onAction(proposal._id, "accept")}>
              <FaCheckCircle size={18} /> Accept
            </button>
            <button className="sl-btn sl-btn-reject" onClick={() => onAction(proposal._id, "reject")}>
              <FaTimesCircle size={18} /> Reject
            </button>
          </>
        )}
        {status === "accepted" && (
          <div className="sl-final sl-final-accepted"><FaCheckCircle size={20} /> Proposal Accepted</div>
        )}
        {status === "rejected" && (
          <div className="sl-final sl-final-rejected"><FaTimesCircle size={20} /> Proposal Rejected</div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const ShortlistedProposals = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [proposals, setProposals] = useState([]);
  const [loading,   setLoading]   = useState(true);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("customerToken");
      const res   = await fetch(`http://localhost:5000/proposals/${id}/${action}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: `Proposal ${action}ed successfully!`, timer: 1500, showConfirmButton: false });
        setProposals(prev => prev.filter(p => p._id !== id));
      } else {
        Swal.fire({ icon: "error", title: "Failed", text: data.error || "Failed to update proposal" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Something went wrong. Please try again." });
    }
  };

  const confirmAction = async (id, action) => {
    const result = await Swal.fire({
      title: `Are you sure you want to ${action === "accept" ? "accept" : "reject"} this proposal?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: action === "accept" ? "#15803d" : "#b91c1c",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (result.isConfirmed) handleAction(id, action);
  };

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        const token      = localStorage.getItem("customerToken");
        const customerId = customer?._id || customer?.id;
        if (!customerId) { setLoading(false); return; }
        const res  = await fetch(`http://localhost:5000/proposals/customer/${customerId}/shortlisted`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProposals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching shortlisted proposals:", err);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };
    if (customer?._id || customer?.id) fetchShortlisted();
  }, [customer?._id, customer?.id]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="sl-loader">
          <div className="sl-spinner" />
          <p className="sl-loader-text">Loading shortlisted proposals…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="sl-root">

        <div className="sl-header">
          <span className="sl-eyebrow">Customer Portal</span>
          <h1 className="sl-title">Shortlisted <span>Proposals</span></h1>
          <p className="sl-subtitle">Review your shortlisted bids and make a final decision</p>
          {proposals.length > 0 && (
            <div className="sl-badge">
              <span className="sl-badge-dot" />
              {proposals.length} shortlisted {proposals.length === 1 ? "proposal" : "proposals"}
            </div>
          )}
        </div>

        {proposals.length === 0 ? (
          <div className="sl-empty">
            <div className="sl-empty-icon">⭐</div>
            <h3 className="sl-empty-title">No Shortlisted Proposals</h3>
            <p className="sl-empty-text">
              You haven't shortlisted any proposals yet.<br />
              Go to <strong>Proposals Received</strong> to review and shortlist contractors.
            </p>
          </div>
        ) : (
          <div className="sl-grid">
            {proposals.map(proposal => (
              <ProposalCard key={proposal._id} proposal={proposal} onAction={confirmAction} />
            ))}
          </div>
        )}

      </div>
    </>
  );
};