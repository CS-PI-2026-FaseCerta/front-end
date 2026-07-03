import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import HeaderDashBoard from "../../../home/components/headerDashBoard/HeaderDashBoard";
import Sidebar from "../../../home/components/menu/Sidebar";
import Footer from "../Footer/Footer";
import { getCurrentUser } from "../../../auth/mockAuth";
import "./DashboardLayout.css";

export const DashboardContext = createContext({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
});

const DashboardLayout = ({ children, hideFooter = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentUser = getCurrentUser();
  const perfilAtual = currentUser?.perfil || "gestor";

  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <DashboardContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      <div
        className={`dashboard-layout ${isSidebarOpen ? "dashboard-layout--sidebar-open" : ""}`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          profile={perfilAtual}
        />
        
        <div className="dashboard-layout__content">
          <HeaderDashBoard
            onMenuToggle={handleToggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          
          <main className="dashboard-layout__main">
            {children || <Outlet />}
          </main>

          {!hideFooter && <Footer />}
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export default DashboardLayout;
