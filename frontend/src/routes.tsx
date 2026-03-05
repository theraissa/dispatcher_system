import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home.tsx";
import ClientRecord from "./pages/record/client-record.tsx";

export default function FrontendRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<ClientRecord />} />
      </Routes>
    </Router>
  );
}
