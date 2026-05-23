import type { CreateUserRequest, UserResponse } from "@/types/user.types"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import type { RegisterDispatcherRequest, RegisterDispatcherResponse } from "../types/dispatcher.types"
import { apiClient } from "./api-client"


export const registerUser = {

    /**
     * Cria um novo despachante no sistema.
     */
    registerDispatcher(data: RegisterDispatcherRequest): Promise<RegisterDispatcherResponse> {
        return apiClient.post<RegisterDispatcherResponse>(BACKEND_ROUTES.dispatcher.create, data)
    },

    /**
     * Cria um novo usuário no sistema.
     */
    registerClient(data: CreateUserRequest): Promise<UserResponse> {
        return apiClient.post<UserResponse>(BACKEND_ROUTES.user.create, data)
    },
}
