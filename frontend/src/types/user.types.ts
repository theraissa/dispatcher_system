import type { Address, UserType } from "./type"


/**
 * Representa os dados necessários para criar um novo usuário.
 */
export type CreateUserRequest = {
    name: string
    cpf: string
    email: string
    password: string
}


/**
 * Representa o usuário retornado pela API após criação.
 */
export type UserResponse = {
    id: number
    name?: string
    cpf?: string
    email?: string
    date_birth?: string
    contact?: string
    photo?: string
    instagram?: string
    website?: string
    created_at: string
    updated_at: string
    deleted_at?: string | null
}


/*
* Representa o perfil completo do cliente, incluindo dados do usuário.
*/
export type ProfileUser = {
    user: UserType
    address: Address
}

/*
* Representa o perfil publico do cliente, como redes sociais e foto de perfil.
*/
export type ProfilePublicUser = {
    photo: File | string
    instagram: string
    website: string
}
