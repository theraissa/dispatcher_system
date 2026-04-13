import { apiClient } from "./api-client"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import type { CreateUserRequest, UserResponse } from "@/types/user.types"

/**
 * Cria um novo usuário no sistema.
 */
export async function registerUser(data: CreateUserRequest): Promise<UserResponse> {
    return apiClient.post<UserResponse>(BACKEND_ROUTES.users.create, data)
}
