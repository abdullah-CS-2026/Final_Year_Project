import { Outlet } from "react-router-dom";
import { useState } from "react";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerSidebar } from "./CustomerSidebaar";

export const CustomerLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex vh-100">
      <CustomerSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Right side */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "220px" }}>
        <CustomerHeader setShowSidebar={setShowSidebar} />
        <main className="flex-grow-1 p-3 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
