import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import ClientRecord from "./pages/record/ClientRecord.tsx";

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
