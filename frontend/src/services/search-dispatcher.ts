import type { SearchDispatchersParams } from "@/types/dispatcher.types";
import { apiClient } from "./api-client";
import { BACKEND_ROUTES } from "@/routes/backend-routes";


/**
 * Realiza a busca de despachantes no backend com base nos filtros informados.
 */
export async function searchDispatchers(params: SearchDispatchersParams) {
  return apiClient.get(BACKEND_ROUTES.dispatcher.search, params);
}
