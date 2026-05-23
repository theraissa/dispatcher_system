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

        {/* Admin */}
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>

          {clientRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

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
