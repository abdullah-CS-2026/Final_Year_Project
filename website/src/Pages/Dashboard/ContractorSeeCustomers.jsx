import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaMapMarkerAlt } from "react-icons/fa";
import { ChevronRight, Search, HardHat } from "lucide-react";

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .csc-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f4ff 0%, #dbeeff 60%, #eff6ff 100%);
    padding: 56px 28px 72px;
  }

  /* ══ Header ══ */
  .csc-header {
    text-align: center;
    margin-bottom: 44px;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .csc-eyebrow {
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

  .csc-title {
    font-size: clamp(30px, 5vw, 46px);
    font-weight: 800;
    color: #0a0f1e;
    margin: 0 0 12px;
    line-height: 1.12;
    letter-spacing: -0.6px;
  }

  .csc-title span {
    background: linear-gradient(135deg, #1d4ed8 20%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .csc-subtitle {
    font-size: 18px;
    color: #475569;
    font-weight: 600;
    margin: 0;
  }

  .csc-count-badge {
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

  .csc-count-dot {
    width: 11px; height: 11px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }

  /* ══ Search ══ */
  .csc-search-wrap {
    max-width: 560px;
    margin: 0 auto 32px;
    position: relative;
    animation: fadeUp 0.5s ease both;
    animation-delay: 0.1s;
  }

  .csc-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #93c5fd;
    pointer-events: none;
  }

  .csc-search {
    width: 100%;
    padding: 14px 18px 14px 50px;
    border-radius: 14px;
    border: 1.5px solid #e0eaff;
    background: #fff;
    font-size: 16px;
    font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1e293b;
    outline: none;
    box-shadow: 0 4px 16px rgba(37,99,235,0.08);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .csc-search:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1), 0 4px 16px rgba(37,99,235,0.1);
  }

  .csc-search::placeholder { color: #cbd5e1; }

  /* ══ List ══ */
  .csc-list {
    max-width: 700px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ══ Customer Row Card ══ */
  .csc-item {
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 4px 18px rgba(37,99,235,0.08);
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 22px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease, border-color 0.25s ease;
  }

  .csc-item:hover {
    transform: translateX(6px) scale(1.012);
    box-shadow: 0 12px 36px rgba(37,99,235,0.18);
    border-color: #93c5fd;
  }

  .csc-item:nth-child(1)  { animation-delay: 0.06s; }
  .csc-item:nth-child(2)  { animation-delay: 0.11s; }
  .csc-item:nth-child(3)  { animation-delay: 0.16s; }
  .csc-item:nth-child(4)  { animation-delay: 0.21s; }
  .csc-item:nth-child(5)  { animation-delay: 0.26s; }
  .csc-item:nth-child(6)  { animation-delay: 0.31s; }
  .csc-item:nth-child(7)  { animation-delay: 0.36s; }
  .csc-item:nth-child(8)  { animation-delay: 0.41s; }

  /* ══ Avatar ══ */
  .csc-avatar-wrap { position: relative; flex-shrink: 0; }

  .csc-avatar {
    width: 62px; height: 62px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid #bfdbfe;
    box-shadow: 0 3px 12px rgba(37,99,235,0.18);
    display: block;
  }

  .csc-avatar-fallback {
    width: 62px; height: 62px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1d4ed8, #60a5fa);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 3px 12px rgba(37,99,235,0.22);
    flex-shrink: 0;
  }

  .csc-online-dot {
    position: absolute;
    bottom: 2px; right: 2px;
    width: 14px; height: 14px;
    background: #22c55e;
    border-radius: 50%;
    border: 2.5px solid #fff;
    box-shadow: 0 1px 4px rgba(34,197,94,0.5);
  }

  /* ══ Info ══ */
  .csc-info { flex: 1; min-width: 0; }

  .csc-name {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .csc-project {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    margin: 0 0 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .csc-project strong { color: #1d4ed8; font-weight: 700; }

  .csc-location {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
  }

  /* ══ CTA ══ */
  .csc-action {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .csc-track-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    color: #fff;
    font-size: 15px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(29,78,216,0.32);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s;
    white-space: nowrap;
  }

  .csc-track-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(29,78,216,0.44);
  }

  .csc-track-btn:active { transform: translateY(0); }

  .csc-chevron {
    color: #bfdbfe;
    transition: transform 0.2s ease, color 0.2s;
  }

  .csc-item:hover .csc-chevron {
    transform: translateX(4px);
    color: #60a5fa;
  }

  /* ══ Empty State ══ */
  .csc-empty {
    max-width: 480px;
    margin: 0 auto;
    text-align: center;
    padding: 64px 36px;
    background: #fff;
    border-radius: 28px;
    border: 1.5px solid #e0eaff;
    box-shadow: 0 10px 40px rgba(37,99,235,0.08);
    animation: fadeUp 0.55s ease both;
  }

  .csc-empty-icon {
    width: 88px; height: 88px;
    background: linear-gradient(135deg, #dbeafe, #eff6ff);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    font-size: 40px;
    box-shadow: 0 4px 16px rgba(37,99,235,0.1);
  }

  .csc-empty-title {
    font-size: 26px;
    font-weight: 800;
    color: #0a0f1e;
    margin-bottom: 12px;
  }

  .csc-empty-text {
    font-size: 17px;
    font-weight: 600;
    color: #64748b;
    line-height: 1.75;
    margin: 0;
  }

  /* ══ Loader ══ */
  .csc-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    background: linear-gradient(145deg, #e8f4ff, #dbeeff);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .csc-spinner {
    width: 56px; height: 56px;
    border: 5px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  .csc-loader-text {
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
    .csc-root { padding: 36px 16px 56px; }
    .csc-title { font-size: 26px; }
    .csc-track-btn span { display: none; }
    .csc-item { padding: 14px 16px; gap: 14px; }
  }
`;

/* ═══════════════════════════════════════════
   AVATAR with fallback
═══════════════════════════════════════════ */
const Avatar = ({ src, name }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="csc-avatar-fallback">
        <FaUserCircle size={32} />
      </div>
    );
  }
  return <img className="csc-avatar" src={src} alt={name} onError={() => setErr(true)} />;
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const ContractorSeeCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [query,     setQuery]     = useState("");
  const navigate = useNavigate();

  const contractorId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const res  = await fetch(`http://localhost:5000/contractor/${contractorId}/accepted`);
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    if (contractorId) fetchAccepted();
    else setLoading(false);
  }, [contractorId]);

  const handleClick = (proposalId) => {
    localStorage.setItem("selectedProposalId", proposalId);
    navigate("/contractor-project-track");
  };

  const filtered = customers.filter(item =>
    item.customer?.name?.toLowerCase().includes(query.toLowerCase()) ||
    item.project?.title?.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="csc-loader">
          <div className="csc-spinner" />
          <p className="csc-loader-text">Loading your customers…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="csc-root">

        {/* ── Header ── */}
        <div className="csc-header">
          <span className="csc-eyebrow">Contractor Portal</span>
          <h1 className="csc-title">Accepted <span>Customers</span></h1>
          <p className="csc-subtitle">Track projects for all customers who accepted your proposals</p>
          {customers.length > 0 && (
            <div className="csc-count-badge">
              <span className="csc-count-dot" />
              {customers.length} active {customers.length === 1 ? "customer" : "customers"}
            </div>
          )}
        </div>

        {customers.length === 0 ? (
          <div className="csc-empty">
            <div className="csc-empty-icon">🤝</div>
            <h3 className="csc-empty-title">No Customers Yet</h3>
            <p className="csc-empty-text">
              No customers have accepted your proposals yet.<br />
              Keep sending compelling bids on open projects!
            </p>
          </div>
        ) : (
          <>
            {/* ── Search ── */}
            <div className="csc-search-wrap">
              <Search size={20} className="csc-search-icon" />
              <input
                className="csc-search"
                placeholder="Search customer or project…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            {/* ── List ── */}
            <div className="csc-list">
              {filtered.length === 0 ? (
                <div className="csc-empty" style={{ marginTop: 0 }}>
                  <div className="csc-empty-icon">🔍</div>
                  <h3 className="csc-empty-title">No Results</h3>
                  <p className="csc-empty-text">No customers match your search.</p>
                </div>
              ) : (
                filtered.map(item => (
                  <div
                    key={item._id}
                    className="csc-item"
                    onClick={() => handleClick(item._id)}
                  >
                    {/* Avatar */}
                    <div className="csc-avatar-wrap">
                      <Avatar
                        src={item.customer?.profilePic
                          ? `http://localhost:5000${item.customer.profilePic}`
                          : null}
                        name={item.customer?.name}
                      />
                      <span className="csc-online-dot" />
                    </div>

                    {/* Info */}
                    <div className="csc-info">
                      <p className="csc-name">{item.customer?.name || "Customer"}</p>
                      <p className="csc-project">
                        Project: <strong>{item.project?.title || "N/A"}</strong>
                      </p>
                      {item.project?.location && (
                        <div className="csc-location">
                          <FaMapMarkerAlt size={11} />
                          {item.project.location}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="csc-action">
                      <button
                        className="csc-track-btn"
                        onClick={e => { e.stopPropagation(); handleClick(item._id); }}
                      >
                        <HardHat size={17} />
                        <span>Track Project</span>
                      </button>
                      <ChevronRight size={22} className="csc-chevron" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </>
  );
};