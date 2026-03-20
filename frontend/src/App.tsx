import { Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/analyze" element={<Dashboard />} />
      <Route path="/optimize" element={<div className="p-8">Optimize page (next)</div>} />
      {/* <Route path="/status" element={<div className="p-8">Status page (next)</div>} /> */}
      {/* <Route path="/settings" element={<div className="p-8">Settings page (next)</div>} /> */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

