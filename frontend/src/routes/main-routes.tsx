import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "../pages/home.tsx";
import ClientRecord from "../pages/record/client-record.tsx";
import InitialSearchDisp from '../pages/client/initial-search-disp.tsx';
import DispatcherRecord from '../pages/record/dispatcher-record.tsx';
import Login from '../pages/login.tsx';
import ProfilePage from '../pages/dispatcher/profile.tsx';
import AdminDashboard from '../pages/admin/admin-dashboard.tsx';
import AdminDispatchers from '../pages/admin/admin-dispatchers.tsx';

import { FRONTEND_ROUTES } from './frontend-routes.ts';

/**
 * Componente responsável por definir as rotas da aplicação.
 */
export function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={FRONTEND_ROUTES.HOME}
          element={<Home />}
        />

        <Route
          path={FRONTEND_ROUTES.LOGIN}
          element={<Login />}
        />

        <Route
          path={FRONTEND_ROUTES.REGISTER.CLIENT}
          element={<ClientRecord />}
        />
        <Route
          path={FRONTEND_ROUTES.REGISTER.DISPATCHER}
          element={<DispatcherRecord />}
        />

        <Route
          path={FRONTEND_ROUTES.INITIAL.SEARCH_DISPATCHER}
          element={<InitialSearchDisp />}
        />
        <Route
          path={FRONTEND_ROUTES.INITIAL.DISPATCHER_PROFILE}
          element={<ProfilePage />}
        />

        <Route path={FRONTEND_ROUTES.ADMIN.ROOT} element={<AdminDashboard />} />
        <Route
          path={FRONTEND_ROUTES.ADMIN.DISPATCHERS}
          element={<AdminDispatchers />}
        />
        <Route
          path={FRONTEND_ROUTES.ADMIN.SERVICES}
          element={<AdminDispatchers />}
        />
      </Routes>
    </BrowserRouter>
  )
}
