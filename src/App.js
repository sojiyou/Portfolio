import { Routes, Route } from "react-router-dom";
import PortfolioPage from "./pages/PortfolioPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<PortfolioPage />} />
    </Routes>
  );
}
