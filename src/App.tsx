import { useState } from "react";

import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Vetements from "./pages/Vetements";
import Statuts from "./pages/Statuts";
import Paiements from "./pages/Paiements";
import Stock from "./pages/Stock";
import Login from "./pages/Login";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [isAuth, setIsAuth] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔐 LOGIN
  if (!isAuth) {
    return <Login onLogin={() => setIsAuth(true)} />;
  }

  // 📄 ROUTING SIMPLE (sans React Router)
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <Clients />;
      case "vetements":
        return <Vetements />;
      case "statuts":
        return <Statuts />;
      case "paiements":
        return <Paiements />;
      case "stock":
        return <Stock />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sidebar
      open={sidebarOpen}
        page={page}
        setPage={(p) => {
          setPage(p);
          setSidebarOpen(false); // ferme sur mobile après clic
        }}
        onLogout={() => setIsAuth(false)}
      
      />

      {/* MAIN AREA */}
      <div
  style={{
    flex: 1,// IMPORTANT
    display: "flex",
    flexDirection: "column",
    marginLeft: 240,
  }}
>
        {/* TOPBAR */}
        <Topbar
          page={page}
          setPage={setPage}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* CONTENT */}
        <main style={{ padding: 24, flex: 1, background: "#f8f9ff" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}