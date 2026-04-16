import { Outlet } from "react-router-dom";
import { useState } from "react";
import { ContractorSidebar } from "./ContractorSidebar";
import { ContractorHeader } from "./ContractorHeader";
const BASE_URL = import.meta.env.VITE_API_URL;
export const ContractorLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex vh-100">
      <ContractorSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Right side */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "220px" }}>
        <ContractorHeader setShowSidebar={setShowSidebar} />
        <main className="flex-grow-1 p-3 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
