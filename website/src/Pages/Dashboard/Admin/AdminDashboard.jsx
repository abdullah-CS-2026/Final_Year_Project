import React, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchStats();

  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load admin stats", err);
    }
  };

  if (!stats) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary fw-bold">Admin Dashboard</h2>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="row g-3">
        <StatCard title="Total Contractors" value={stats.totalContractors} />
        <StatCard title="Total Customers" value={stats.totalCustomers} />
        <StatCard title="Pending Contractors" value={stats.pendingContractors} />
        <StatCard title="Running Bids" value={stats.runningBids} />
        <StatCard title="Successful Bids" value={stats.successfulBids} />
        <StatCard title="Rejected Proposals" value={stats.rejectedProposals} />
        <StatCard title="Total Projects" value={stats.totalProjects} />
        <StatCard title="Open Projects" value={stats.openProjects} />
        <StatCard title="Closed Projects" value={stats.closedProjects} />
      </div>

      {/* ===== CHART PLACEHOLDER ===== */}
      <div className="card mt-5 p-4 shadow-sm">
        <h5>Charts Section (Next Step)</h5>
        <p className="text-muted">
          Add Bar / Pie charts here using Recharts or Chart.js
        </p>
      </div>

      {/* ===== TABLE PLACEHOLDER ===== */}
      <div className="card mt-4 p-4 shadow-sm">
        <h5>Recent Activity Tables</h5>
        <p className="text-muted">
          Latest contractors, projects, proposals
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="col-md-4 col-lg-3">
    <div className="card shadow-sm text-center p-3">
      <h6 className="text-muted">{title}</h6>
      <h3 className="fw-bold text-primary">{value}</h3>
    </div>
  </div>
);
