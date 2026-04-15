import React, { useState,useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

export const ContractorProjectTrack = () => {
  const proposalId = localStorage.getItem("selectedProposalId");
  if (!proposalId) {
  return (
    <div className="text-center mt-5 text-danger fw-bold">
      ❌ No Proposal Selected
    </div>
  );
}
const [reportingEnabled, setReportingEnabled] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [projectStatus, setProjectStatus] = useState("in_progress");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loadingCompletion, setLoadingCompletion] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");

  const [formData, setFormData] = useState({
    cementQty: "",
    cementPrice: "",
    bricksQty: "",
    bricksPrice: "",
    sandQty: "",
    sandPrice: "",
    steelQty: "",
    steelPrice: "",
    tilesQty: "",
    tilesPrice: "",
    paintQty: "",
    paintPrice: "",
    electricalMaterialsQty: "",
    electricalMaterialsPrice: "",
    labourCount: "",
    labourCost: "",
  });

  const [miscList, setMiscList] = useState([
    { miscItem: "", miscQty: "", miscPrice: "" },
  ]);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchProjectStatus = async () => {
    try {
      const token =
        localStorage.getItem("contractorToken") ||
        localStorage.getItem("token");

      if (!projectId) return;

      const res = await fetch(
        `http://localhost:5000/projects/${projectId}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setProjectStatus(data.project.status);
        console.log("🔥 PROJECT STATUS FROM BACKEND:", data.project.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchProjectStatus();

  const interval = setInterval(fetchProjectStatus, 3000);
  return () => clearInterval(interval);

}, [projectId]);
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("contractorToken") || localStorage.getItem("customerToken") || localStorage.getItem("token");

      // ✅ 1. Check reporting permission
      const proposalRes = await fetch(
        `http://localhost:5000/proposals/get-single/${proposalId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const proposal = await proposalRes.json();
      setReportingEnabled(proposal.isWorkReportingEnabled);
      
      // Set project ID from proposal
      if (proposal.project) {
        const projId = typeof proposal.project === "object" 
          ? proposal.project._id 
          : proposal.project;
        setProjectId(projId);
      }

      // ✅ 2. Fetch daily work
      const workRes = await fetch(
        `http://localhost:5000/dailyWork/${proposalId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await workRes.json();

      if (Array.isArray(data)) {
        setTableData(data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  fetchData();
}, [proposalId]);

useEffect(() => {
  const fetchPermissionAndWork = async () => {
    try {
      const token =
  localStorage.getItem("contractorToken") ||
  localStorage.getItem("customerToken") ||
  localStorage.getItem("token");

      // ✅ always re-check permission from DB
      const proposalRes = await fetch(
        `http://localhost:5000/proposals/get-single/${proposalId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const proposal = await proposalRes.json();
      setReportingEnabled(proposal.isWorkReportingEnabled);

      // ✅ fetch daily work
      const workRes = await fetch(
        `http://localhost:5000/dailyWork/${proposalId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await workRes.json();

      if (Array.isArray(data)) {
        setTableData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // run immediately
  fetchPermissionAndWork();

  // ⭐ IMPORTANT: auto refresh every 3 seconds
  const interval = setInterval(fetchPermissionAndWork, 3000);

  return () => clearInterval(interval);
}, [proposalId]);

  const miscItems = [
    "Transport / Vehicle Fuel",
    "Loading / Unloading Charges",
    "Safety Equipment",
    "Tools & Equipment",
    "Site Maintenance",
    "Water / Electricity Bill",
    "Permit / Admin Charges",
    "Other Miscellaneous",
  ];

  const materialIcons = {
    cement: "🏗",
    bricks: "🧱",
    sand: "🏖",
    steel: "⚙",
    tiles: "🔲",
    paint: "🎨",
    electricalMaterials: "⚡",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMiscChange = (index, e) => {
    const updated = [...miscList];
    updated[index][e.target.name] = e.target.value;
    setMiscList(updated);
  };

  const addMiscRow = () => {
    setMiscList([...miscList, { miscItem: "", miscQty: "", miscPrice: "" }]);
  };

  const contractorId = JSON.parse(localStorage.getItem("user"))?.id;
  const handleSubmit =  async (e) => {
    e.preventDefault();
    setError("");

    const materials = [
      { name: "Cement", qty: formData.cementQty, price: formData.cementPrice },
      { name: "Bricks", qty: formData.bricksQty, price: formData.bricksPrice },
      { name: "Sand", qty: formData.sandQty, price: formData.sandPrice },
      { name: "Steel", qty: formData.steelQty, price: formData.steelPrice },
      { name: "Tiles", qty: formData.tilesQty, price: formData.tilesPrice },
      { name: "Paint", qty: formData.paintQty, price: formData.paintPrice },
      {
        name: "Electrical Materials",
        qty: formData.electricalMaterialsQty,
        price: formData.electricalMaterialsPrice,
      },
    ];

    // Validation
    for (let m of materials) {
      const q = Number(m.qty || 0);
      const p = Number(m.price || 0);
      if ((q > 0 && p === 0) || (p > 0 && q === 0)) {
        setError(
          `⚠ Please fill both Quantity and Price for ${m.name}, or leave both empty.`
        );
        return;
      }
    }

    if (!formData.labourCount || !formData.labourCost) {
      setError("⚠ Please fill both Total Number of Labours and Labour Cost.");
      return;
    }

    const computedMaterials = materials
      .filter((m) => Number(m.qty) > 0 && Number(m.price) > 0)
      .map((m) => ({
        ...m,
        total: Number(m.qty) * Number(m.price),
      }));

    const materialTotal = computedMaterials.reduce(
      (sum, m) => sum + m.total,
      0
    );

    const miscTotal = miscList.reduce(
      (sum, m) => sum + Number(m.miscPrice || 0),
      0
    );

    const additionalTotal =
      Number(formData.labourCost || 0) + Number(miscTotal);

    const total = materialTotal + additionalTotal;

    const entry = {
      date: new Date(),
      materials: computedMaterials,
      labourCount: formData.labourCount,
      labourCost: formData.labourCost,
      miscList,
      materialTotal,
      additionalTotal,
      total,
    };

   try {
  const token =
  localStorage.getItem("contractorToken") ||
  localStorage.getItem("customerToken") ||
  localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/dailyWork", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      proposalId,
      contractorId,
      entry,
    }),
  });

if (res.ok) {
const result = await res.json();
setTableData((prev) => [result.dailyWork, ...prev]);

  // ✅ RESET FORM ONLY IF SUCCESS
  setFormData({
    cementQty: "",
    cementPrice: "",
    bricksQty: "",
    bricksPrice: "",
    sandQty: "",
    sandPrice: "",
    steelQty: "",
    steelPrice: "",
    tilesQty: "",
    tilesPrice: "",
    paintQty: "",
    paintPrice: "",
    electricalMaterialsQty: "",
    electricalMaterialsPrice: "",
    labourCount: "",
    labourCost: "",
  });

  setMiscList([{ miscItem: "", miscQty: "", miscPrice: "" }]);

} else {
  const errorData = await res.json();
  setError(errorData.message || "Error saving data");
}


} catch (err) {
  console.error(err);
}
};

 const handleSubmitWork = async () => {
  try {
    setLoadingCompletion(true);
    setCompletionMessage("");

    const token =
      localStorage.getItem("contractorToken") ||
      localStorage.getItem("token");

    if (!projectId) {
      setCompletionMessage("❌ Project ID not found");
      return;
    }

   const contractorId = JSON.parse(localStorage.getItem("user"))?.id;

const response = await fetch(
  `http://localhost:5000/projects/${projectId}/submit`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contractorId,
    }),
  }
);
    if (response.ok) {
      setProjectStatus("submitted");

      setCompletionMessage(
        "✅ Work submitted. Waiting for customer approval"
      );

      setShowConfirmation(false);

    } else {
      const error = await response.json();
      setCompletionMessage(`❌ ${error.error}`);
    }
  } catch (err) {
    console.error(err);
    setCompletionMessage("❌ Something went wrong");
  } finally {
    setLoadingCompletion(false);
  }
};

  const hardcodedContractorName = "John Contractor";
  const hardcodedProjectName = "Build a 5 Marla House";
  const grandTotal = tableData.reduce((sum, row) => sum + row.total, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        <div
          className="card shadow-lg border-0 mb-4"
          style={{ borderRadius: "20px", background: "#fff" }}
        >
          <div className="card-body p-4">
            <h3
              className="mb-4"
              style={{
                color: "#667eea",
                fontWeight: "600",
                borderBottom: "3px solid #667eea",
                paddingBottom: "0.5rem",
                display: "inline-block",
              }}
            >
              ✏ Enter Material Details
              <p style={{ color: "red", fontWeight: "bold" }}>
  STATUS: {projectStatus}
</p>
            </h3>

            {error && (
              <div className="alert alert-danger fw-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Quantities & Prices */}
              <div className="mb-4">
                <h5 style={{ color: "#764ba2", fontWeight: "600" }}>
                  📦 Quantities & Prices
                </h5>
                <div className="row g-3">
                  {[
                    "cement",
                    "bricks",
                    "sand",
                    "steel",
                    "tiles",
                    "paint",
                    "electricalMaterials",
                  ].map((item) => (
                    <div className="col-md-6 col-lg-4" key={item}>
                      <label className="form-label fw-semibold">
                        {materialIcons[item]} {item.replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          name={`${item}Qty`}
                          value={formData[`${item}Qty`]}
                          onChange={handleChange}
                          placeholder="Enter quantity"
                        />
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          name={`${item}Price`}
                          value={formData[`${item}Price`]}
                          onChange={handleChange}
                          placeholder="Enter price (₹)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labour */}
              <div className="mb-4">
                <h5 style={{ color: "#764ba2", fontWeight: "600" }}>
                  👷 Labour Details
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Total Number of Labours
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      name="labourCount"
                      value={formData.labourCount}
                      onChange={handleChange}
                      placeholder="Enter total labours"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Total Labour Cost
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      name="labourCost"
                      value={formData.labourCost}
                      onChange={handleChange}
                      placeholder="Enter labour cost (₹)"
                    />
                  </div>
                </div>
              </div>

              {/* Miscellaneous */}
              <div className="mb-4">
                <h5 style={{ color: "#764ba2", fontWeight: "600" }}>
                  🧾 Miscellaneous
                </h5>
                {miscList.map((misc, index) => (
                  <div className="row g-2 mb-2" key={index}>
                    <div className="col-md-4">
                      <select
                        className="form-select"
                        name="miscItem"
                        value={misc.miscItem}
                        onChange={(e) => handleMiscChange(index, e)}
                      >
                        <option value="">-- Select Item --</option>
                        {miscItems.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="miscQty"
                        value={misc.miscQty}
                        onChange={(e) => handleMiscChange(index, e)}
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="miscPrice"
                        value={misc.miscPrice}
                        onChange={(e) => handleMiscChange(index, e)}
                        placeholder="Enter price (₹)"
                      />
                    </div>
                  </div>
                ))}
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={addMiscRow}
                  >
                    ➕ Add More
                  </button>
                </div>
              </div>

              <div className="text-center mt-4">
                
                 <button
  type="submit"
  disabled={!reportingEnabled}
  className="btn btn-lg px-5"
  style={{
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "50px",
    fontWeight: "600",
  }}
>
  {reportingEnabled
    ? "✅ Submit Entry"
    : "🚫 Reporting Disabled by Customer"}
</button> 
              </div>
            </form>
          </div>
        </div>

        {/* 🆕 Project Status & Completion Section */}
        <div
          className="card shadow-lg border-0 mb-4"
          style={{ borderRadius: "20px", background: "#fff" }}
        >
          <div className="card-body p-4">
            <h3
              className="mb-4"
              style={{
                color: "#667eea",
                fontWeight: "600",
                borderBottom: "3px solid #667eea",
                paddingBottom: "0.5rem",
                display: "inline-block",
              }}
            >
              ✅ Mark Project Completion
            </h3>

            <div
              style={{
                background: "#f8f9fa",
                padding: "1.5rem",
                borderRadius: "15px",
                border: "2px solid #e9ecef",
              }}
            >
              <div className="row mb-3">
                <div className="col-md-6">
                  <p style={{ color: "#666", fontWeight: "500" }}>
                    <strong>📌 Project:</strong> {hardcodedProjectName}
                  </p>
                  <p style={{ color: "#666", fontWeight: "500" }}>
                    <strong>👷 Contractor:</strong> {hardcodedContractorName}
                  </p>
                </div>
                <div className="col-md-6">
                  <p style={{ color: "#666", fontWeight: "500" }}>
                    <strong>📊 Status:</strong>{" "}
                    <span
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontWeight: "600",
                        background:
                          projectStatus === "completed"
                            ? "#d4edda"
                            : "#fff3cd",
                        color:
                          projectStatus === "completed"
                            ? "#155724"
                            : "#856404",
                      }}
                    >
                      {projectStatus === "completed"
                        ? "✅ Completed"
                        : "🔄 In-progress"}
                    </span>
                  </p>
                </div>
              </div>

              {projectStatus === "in_progress" && (
                <div className="alert alert-info mb-3">
                  ℹ️ Once you mark this project as <strong>completed</strong>, the
                  customer will be able to close the project and submit ratings &
                  reviews.
                </div>
              )}

              {projectStatus === "completed" && (
                <div className="alert alert-success mb-3">
                  ✅ Project marked as completed! Customer can now close it and
                  submit your rating.
                </div>
              )}

              {completionMessage && (
                <div
                  className={`alert ${
                    completionMessage.includes("✅")
                      ? "alert-success"
                      : "alert-danger"
                  } mb-3`}
                >
                  {completionMessage}
                </div>
              )}

              <div className="text-center">
                {projectStatus === "in_progress" && (
                  <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={loadingCompletion}
                    className="btn btn-lg px-5"
                    style={{
                      background:
                        "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      color: "white",
                      borderRadius: "50px",
                      fontWeight: "600",
                      opacity: loadingCompletion ? 0.6 : 1,
                    }}
                  >
                    {loadingCompletion
  ? "⏳ Processing..."
  : "📤 Submit Work"}
                  </button>
                )}

                {projectStatus === "completed" && (
                  <p style={{ color: "#28a745", fontWeight: "600" }}>
                    ✅ Waiting for customer to close project...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "15px",
                padding: "2rem",
                maxWidth: "500px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
            >
              <h4 style={{ color: "#667eea", marginBottom: "1rem" }}>
                Are you sure?
              </h4>
              <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                Once you mark this project as <strong>completed</strong>, the customer
                will be able to:
              </p>
              <ul style={{ color: "#555", marginBottom: "1.5rem" }}>
                <li>✅ Close the project</li>
                <li>✅ Submit ratings and reviews</li>
                <li>✅ Rate your performance as a contractor</li>
              </ul>

              <div className="d-flex gap-2 justify-content-end">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="btn btn-outline-secondary px-4"
                  style={{ borderRadius: "25px" }}
                >
                  Cancel
                </button>
                <button
                 onClick={handleSubmitWork} 
                  disabled={loadingCompletion}
                  className="btn px-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                    color: "white",
                    borderRadius: "25px",
                    fontWeight: "600",
                  }}
                >
                  {loadingCompletion ? "⏳ Marking..." : "Yes, Submit Work"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Table */}
        <div className="table-responsive mt-5">
          {tableData.map((entry, idx) => (
            <div key={idx} className="mb-5">
              <h5 className="fw-bold text-white">
  📅 {new Date(entry.date).toLocaleString()}
</h5>

              <table className="table table-bordered text-center align-middle mt-3 bg-white">
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
                  {entry?.materials.map((m, i) => (
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
          ))}

          {tableData.length > 0 && (
            <div className="alert alert-success text-end fw-bold fs-5">
              🧮 Grand Total for All Entries: ₹{grandTotal}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
