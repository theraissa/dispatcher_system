import type { CreateUserRequest, UserResponse } from "@/types/user.types"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import { apiClient } from "./api-client"

/**
 * Cria um novo usuário no sistema.
 */
export async function registerUser(data: CreateUserRequest): Promise<UserResponse> {
    return apiClient.post<UserResponse>(BACKEND_ROUTES.user.create, data)
}
