import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/RoleSelection.css";

export const RoleSelection = () => {
  const navigate = useNavigate();

  const handleContractorClick = () => {
    navigate("/contractor-login");
  };

  const handleCustomerClick = () => {
    navigate("/customer-login");
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h2 className="role-selection-heading">Join as a:</h2>
        <div className="d-flex gap-3">
          <button
            className="btn btn-primary btn-lg flex-fill py-3 role-selection-button contractor-button"
            onClick={handleContractorClick}
          >
            Contractor
          </button>
          <button
            className="btn btn-success btn-lg flex-fill py-3 role-selection-button customer-button"
            onClick={handleCustomerClick}
          >
            Customer
          </button>
        </div>
      </div>
    </div>
  );
};
