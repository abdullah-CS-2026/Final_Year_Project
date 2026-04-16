import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import ReviewSubmission from "../../../components/ReviewSubmission";
const BASE_URL = import.meta.env.VITE_API_URL;
export const CustomerProjectTrack = () => {
  const customerId = JSON.parse(localStorage.getItem("user"))?.id;
  const [tableData, setTableData] = useState([]);
  const [proposalId, setProposalId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [contractorId, setContractorId] = useState(null);
  const [reportingEnabled, setReportingEnabled] = useState(false);
  const [completionTime, setCompletionTime] = useState("");
  const [remainingDays, setRemainingDays] = useState(null);
  const [projectStatus, setProjectStatus] = useState(null);


  const handleCloseProject = async () => {
  try {
    // 🔍 DEBUG: Log input data
    console.log("🔍 [CLOSE PROJECT] Starting...");
    console.log("   - projectId:", projectId);
    console.log("   - customerId:", customerId);
    
    // Validate inputs
    if (!projectId) {
      alert("❌ Project ID not found");
      return;
    }

    // Get token with fallback
    const token = 
      localStorage.getItem("customerToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    console.log("🔍 [CLOSE PROJECT] Token found:", !!token);

    if (!token) {
      alert("❌ Authentication token not found. Please log in again.");
      return;
    }

    const url = `${BASE_URL}/projects/${projectId}/close`;
    console.log("🔍 [CLOSE PROJECT] Sending request to:", url);
    console.log("   - Method: PATCH");
    console.log("   - Headers: Authorization Bearer");

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🔍 [CLOSE PROJECT] Response status:", res.status);

    const data = await res.json();
    console.log("🔍 [CLOSE PROJECT] Response data:", data);

    if (res.ok) {
      console.log("✅ [CLOSE PROJECT] Success!");
      setProjectStatus("completed");
      alert("✅ Project marked as completed. You can now submit ratings.");
    } else {
      console.error("❌ [CLOSE PROJECT] Error:", data);
      alert(`❌ Failed to close project: ${data.error || "Unknown error"}`);
    }

  } catch (err) {
    console.error("❌ [CLOSE PROJECT] Exception:", err);
    alert(`❌ Something went wrong: ${err.message}`);
  }
};

useEffect(() => {
  if (!completionTime) return;

  const calculateRemainingDays = () => {
    const createdDate = new Date(localStorage.getItem("proposalAcceptedDate") || Date.now());

    const match = completionTime.match(/(\d+)\s*(day|month|year)/i);
    if (!match) return;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    const deadline = new Date(createdDate);

    if (unit.includes("day")) deadline.setDate(deadline.getDate() + value);
    if (unit.includes("month")) deadline.setMonth(deadline.getMonth() + value);
    if (unit.includes("year")) deadline.setFullYear(deadline.getFullYear() + value);

    const diff = deadline - new Date();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    setRemainingDays(daysLeft > 0 ? daysLeft : 0);
  };

  calculateRemainingDays();

  const interval = setInterval(calculateRemainingDays, 60000);

  return () => clearInterval(interval);
}, [completionTime]);

  useEffect(() => {
    let interval;

    const fetchDailyWork = async () => {
      try {
        const token =
  localStorage.getItem("customerToken") ||
  localStorage.getItem("customer") ||
  localStorage.getItem("token");

if (!token) {
  console.error("❌ No token found");
  return;
}

        // 1️⃣ Get accepted proposals
        const proposalRes = await fetch(
          `${BASE_URL}/proposals/customer/${customerId}/accepted`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const proposals = await proposalRes.json();
        if (!Array.isArray(proposals) || proposals.length === 0) return;

        // 2️⃣ Resolve active proposalId
        let activeId = localStorage.getItem("selectedProposalId");

        if (!activeId || !proposals.find(p => p._id === activeId)) {
          activeId = proposals[0]._id;
          localStorage.setItem("selectedProposalId", activeId);
        }

        const activeProposal = proposals.find(p => p._id === activeId);
        if (!activeProposal) return;

        setProposalId(activeProposal._id);
        
        // Extract projectId - handle both object and string cases
        const projId = typeof activeProposal.project === "object" 
          ? activeProposal.project?._id 
          : activeProposal.project;
        setProjectId(projId);
        
        // Extract contractorId - handle both object and string cases
        const contId = typeof activeProposal.contractor === "object"
          ? activeProposal.contractor?._id
          : activeProposal.contractor;
        setContractorId(contId);
        
        setReportingEnabled(activeProposal.isWorkReportingEnabled);
        setCompletionTime(activeProposal.completionTime || "");

        // 3️⃣ Fetch project details to get status (only once, not in setInterval)
        if (projId) {
          try {
            const projectRes = await fetch(
              `${BASE_URL}/projects/${projId}/details`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (projectRes.ok) {
              const projectData = await projectRes.json();
              setProjectStatus(projectData.project?.status);
            }
          } catch (err) {
  console.error("❌ Project fetch failed:", err.response?.data || err.message);
}
        }

        // 4️⃣ Fetch daily work
        const workRes = await fetch(
          `${BASE_URL}/dailyWork/${activeProposal._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const works = await workRes.json();
        if (Array.isArray(works)) {
          setTableData(works);
        }

      } catch (err) {
        console.error("Error fetching daily work:", err);
      }
    };

    if (customerId) {
      fetchDailyWork();
      interval = setInterval(fetchDailyWork, 3000); // keep UI synced
    }

    return () => clearInterval(interval);

  }, [customerId]);

  const grandTotal = tableData.reduce((sum, row) => sum + row.total, 0);

  if (!customerId) {
    return (
      <div className="text-center mt-5 text-danger fw-bold">
        ❌ No Customer Logged In
      </div>
    );
  }

const toggleReporting = async () => {
  if (!proposalId) {
    console.error("Proposal ID missing");
    return;
  }

  try {
    const token = localStorage.getItem("customerToken");

    const res = await fetch(
      `${BASE_URL}/proposals/toggle-work/${proposalId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    console.log("Toggle response:", data);

    if (res.ok) {
      setReportingEnabled(data.isWorkReportingEnabled);
    }

  } catch (err) {
    console.error("Toggle error:", err);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        <div className="card shadow-lg border-0" style={{ borderRadius: "20px", background: "#fff" }}>
          
          <div className="card-body p-4">
           <div className="d-flex justify-content-between align-items-center mb-3">
            <button
  onClick={toggleReporting}
  disabled={!proposalId}
  className="btn btn-lg"
  style={{
    background: reportingEnabled ? "#dc3545" : "#28a745",
    color: "white",
    fontWeight: "bold",
    borderRadius: "10px",
  }}
>
  {reportingEnabled
    ? "⛔ Stop Project Reporting"
    : "🚀 Start Project Reporting"}
</button>

  <h3
    style={{
      color: "#667eea",
      fontWeight: "600",
      borderBottom: "3px solid #667eea",
      paddingBottom: "0.5rem",
      display: "inline-block",
    }}
  >
    📋 Contractor Daily Work Updates
  </h3>

  {completionTime && (
    <div
      className="text-end p-3"
      style={{
        background: "#f8f9ff",
        borderRadius: "10px",
        border: "2px solid #667eea",
        minWidth: "220px"
      }}
    >
      <div style={{ fontSize: "0.9rem", color: "#666" }}>
        Completion Time
      </div>

      <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#667eea" }}>
        {completionTime}
      </div>

      <div style={{ fontSize: "0.9rem", marginTop: "5px" }}>
        ⏳ Remaining Days:
        <span style={{ fontWeight: "bold", color: "#dc3545" }}>
          {" "}
          {remainingDays ?? "--"}
        </span>
      </div>
    </div>
  )}

</div>
            

            {tableData.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
                <p style={{ color: "#666", fontSize: "1.1rem" }}>
                  No work uploaded by contractor yet.
                </p>
              </div>
            ) : (
              tableData.map((entry, idx) => (
                <div key={idx} className="mb-5">
                  <h5 className="fw-bold">📅 Date: {new Date(entry.date).toLocaleDateString()}</h5>

                  <table className="table table-bordered text-center align-middle mt-3">
                    <thead
                      style={{
                        background: "linear-gradient(135deg,#667eea,#764ba2)",
                        color: "white",
                      }}
                    >
                      <tr>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Price (₹/unit)</th>
                        <th>Total Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.materials?.map((m, i) => (
                        <tr key={i}>
                          <td>{m.name}</td>
                          <td>{m.qty}</td>
                          <td>₹{m.price}</td>
                          <td>₹{m.total}</td>
                        </tr>
                      ))}

                      <tr className="table-light fw-bold">
                        <td colSpan="3">Total Material Cost</td>
                        <td>₹{entry.materialTotal}</td>
                      </tr>

                      <tr>
                        <td>Labour ({entry.labourCount} Workers)</td>
                        <td>-</td>
                        <td>-</td>
                        <td>₹{entry.labourCost}</td>
                      </tr>

                      {entry.miscList?.map(
                        (m, i) =>
                          m.miscItem && (
                            <tr key={i}>
                              <td>{m.miscItem}</td>
                              <td>{m.miscQty}</td>
                              <td>-</td>
                              <td>₹{m.miscPrice}</td>
                            </tr>
                          )
                      )}

                      <tr className="table-info fw-bold">
                        <td colSpan="3">Total Additional Expenses</td>
                        <td>₹{entry.additionalTotal}</td>
                      </tr>

                      <tr className="table-success fw-bold">
                        <td colSpan="3">Grand Total</td>
                        <td>₹{entry.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))
            )}

            {tableData.length > 0 && (
              <div className="alert alert-success text-end fw-bold fs-5">
                🧮 Grand Total for All Entries: ₹{grandTotal}
              </div>
            )}

            {/* ✨ PROJECT CLOSING & REVIEW SECTION ✨ */}
            {projectId && (
              <div style={{ marginTop: "3rem", borderTop: "3px dashed #667eea", paddingTop: "2rem" }}>
                
                {/* Project Closing Component */}
                <div style={{ marginBottom: "2rem" }}>
                  <h4 style={{ color: "#667eea", fontWeight: "700", marginBottom: "1.5rem" }}>
                    🔒 Close & Review Project
                  </h4>
                 {projectStatus === "submitted" && (
  <div className="text-center mb-4">
    <button
      onClick={handleCloseProject}
      className="btn btn-lg btn-success"
    >
      ✅ Close Project
    </button>
  </div>
)}
                </div>

                {/* Review Submission Component (shows only after project is closed) */}
               {projectStatus === "completed" && contractorId && (
  <div style={{ marginTop: "2rem" }}>
    <h4 style={{ color: "#764ba2", fontWeight: "700" }}>
      ⭐ Submit Your Review & Rating
    </h4>

    <ReviewSubmission 
      projectId={projectId}
      customerId={customerId}
      contractorId={contractorId}
    />
  </div>
)}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

