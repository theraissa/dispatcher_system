import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoutes from "./protected-routes.tsx";

import AdminServices from "@/pages/admin/admin-service.tsx";
import AdminDashboard from "../pages/admin/admin-dashboard.tsx";
import AdminDispatchers from "../pages/admin/admin-dispatchers.tsx";

import TicketDetails from "@/pages/client/called-details.tsx";
import CalledClient from "@/pages/client/called.tsx";
import CardProfileDispatcher from "@/pages/client/card-profile-dispatcher.tsx";
import ProfileClient from "@/pages/client/profile.tsx";
import InitialSearchDisp from "../pages/client/initial-search-disp.tsx";

import TicketDetailsDispatcher from "@/pages/dispatcher/called-details.tsx";
import CalledDispatcher from "@/pages/dispatcher/called.tsx";
import HomeDispatcher from "@/pages/dispatcher/home.tsx";
import ProfilePage from "../pages/dispatcher/profile.tsx";

import Home from "../pages/home.tsx";
import Login from "../pages/login.tsx";

import ClientRecord from "../pages/record/client-record.tsx";
import DispatcherRecord from "../pages/record/dispatcher-record.tsx";

import { FRONTEND_ROUTES } from "./frontend-routes.ts";


/**
 * Componente responsável por definir as rotas da aplicação.
 */
export function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            ROTAS PÚBLICAS
        ========================= */}
        <Route path={FRONTEND_ROUTES.HOME} element={<Home />} />
        <Route path={FRONTEND_ROUTES.LOGIN} element={<Login />} />

        <Route path={FRONTEND_ROUTES.REGISTER.CLIENT} element={<ClientRecord />} />
        <Route path={FRONTEND_ROUTES.REGISTER.DISPATCHER} element={<DispatcherRecord />} />

        {/* -------- ADMIN (POR ENQUANTO) -------- */}
        <Route path={FRONTEND_ROUTES.ADMIN.ROOT} element={<AdminDashboard />} />
        <Route path={FRONTEND_ROUTES.ADMIN.DISPATCHERS} element={<AdminDispatchers />} />
        <Route path={FRONTEND_ROUTES.ADMIN.SERVICES} element={<AdminServices />} />

        {/* =========================
            ROTAS PROTEGIDAS
        ========================= */}
        <Route element={<ProtectedRoutes />}>

          {/* -------- CLIENT -------- */}
          <Route path={FRONTEND_ROUTES.CLIENT.SEARCH_DISPATCHER} element={<InitialSearchDisp />} />
          <Route path={FRONTEND_ROUTES.CLIENT.PROFILE} element={<ProfileClient />} />
          <Route path={FRONTEND_ROUTES.CLIENT.CALLED} element={<CalledClient />} />
          <Route path={FRONTEND_ROUTES.CLIENT.CALLED_DETAILS} element={<TicketDetails />} />
          <Route path={FRONTEND_ROUTES.CLIENT.CARD_PROFILE_DISPATCHER} element={<CardProfileDispatcher />} />

          {/* -------- DISPATCHER -------- */}
          <Route path={FRONTEND_ROUTES.DISPATCHER.INITIAL} element={<HomeDispatcher />} />
          <Route path={FRONTEND_ROUTES.DISPATCHER.DISPATCHER_PROFILE} element={<ProfilePage />} />
          <Route path={FRONTEND_ROUTES.DISPATCHER.CALLED} element={<CalledDispatcher />} />
          <Route path={FRONTEND_ROUTES.DISPATCHER.CALLED_DETAILS} element={<TicketDetailsDispatcher />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
