import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import Dashboard from "./pages/Dashboard";
import AuthPage, { SESSION_KEY } from "./pages/AuthPage";

function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  return localStorage.getItem(SESSION_KEY) ? children : <Navigate to="/auth?mode=login" replace state={{ from: location }} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/analyze" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/optimize" element={<RequireAuth><div className="p-8">Optimize page (next)</div></RequireAuth>} />
      {/* <Route path="/status" element={<div className="p-8">Status page (next)</div>} /> */}
      {/* <Route path="/settings" element={<div className="p-8">Settings page (next)</div>} /> */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

