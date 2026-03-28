import { apiClient } from "./api-client"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import type { CreateUserRequest } from "../types/type"

/**
 * Cria um novo usuário no sistema.
 */
export async function registerUser(data: CreateUserRequest): Promise<void> {
    return apiClient.post<void>(BACKEND_ROUTES.users.create, data)
}
