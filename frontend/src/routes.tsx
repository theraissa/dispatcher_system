import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home.tsx";
import ClientRecord from "./pages/record/client-record.tsx";
import InitialSearchDisp from './pages/client/initial-search-disp.tsx';
import DispatcherRecord from './pages/record/dispatcher-record.tsx';
import Login from './pages/login/login.tsx';

export default function FrontendRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/client" element={<ClientRecord />} />
        <Route path="/register/dispatcher" element={<DispatcherRecord />} />
        <Route path="/initial/search-dispatcher" element={<InitialSearchDisp />} />
      </Routes>
    </Router>
  );
}
