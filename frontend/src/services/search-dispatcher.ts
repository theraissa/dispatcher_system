import type { ProfileDispatcher } from "@/types/dispatcher.types";
import { apiClient } from "./api-client";
import { BACKEND_ROUTES } from "@/routes/backend-routes";


/**
 * Realiza a busca de despachantes no backend com base na query informada.
 */
export async function searchDispatchers(query: string): Promise<ProfileDispatcher[]> {
  const response = await apiClient.get<ProfileDispatcher[]>(
    BACKEND_ROUTES.dispatcher.search, { query });

  return response;
}
