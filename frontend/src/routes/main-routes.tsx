import { BrowserRouter, Route, Routes } from "react-router-dom";

import { adminRoutes, clientRoutes, dispatcherRoutes, publicRoutes } from "./group-routes.tsx";
import ProtectedRoute from "./protected-routes.tsx";


/**
 * Componente responsável por definir as rotas da aplicação.
 */
export function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        {/* CLIENTE */}
        <Route element={<ProtectedRoute allowedRoles={["cliente"]} />}>
          {clientRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        {/* DESPACHANTE */}
        <Route element={<ProtectedRoute allowedRoles={["despachante"]} />}>
          {dispatcherRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

