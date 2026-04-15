import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, Button } from "react-bootstrap";
import { HouseDoor, ClipboardCheck, ExclamationCircle } from "react-bootstrap-icons";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/home");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="d-flex flex-column text-white p-3 vh-100"
        style={{ width: "240px", backgroundColor: "rgb(59, 109, 138)" }}
      >
        <h4>Smart House</h4>
        <p className="small">Construction</p>

        <Nav className="flex-column mt-4">
          <NavLink to="/admin" className="text-white mb-3 text-decoration-none">
            <HouseDoor className="me-2" /> Dashboard
          </NavLink>

          <NavLink to="/admin/pending-contractors" className="text-white mb-3 text-decoration-none">
            <ClipboardCheck className="me-2" /> Contractor Requests
          </NavLink>

          <NavLink to="/admin/contractors" className="text-white mb-3 text-decoration-none">
            <ExclamationCircle className="me-2" /> Contractors
          </NavLink>

          <NavLink to="/admin/customers" className="text-white mb-3 text-decoration-none">
            <ExclamationCircle className="me-2" /> Customers
          </NavLink>

          <NavLink to="/admin/running-bids" className="text-white mb-3 text-decoration-none">
            <ExclamationCircle className="me-2" /> Running Bids
          </NavLink>
        </Nav>

        <div className="mt-auto">
          <Button variant="outline-light" className="w-100" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Navbar className="px-3 py-4" style={{ backgroundColor: "rgb(59, 109, 138)" }} />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
