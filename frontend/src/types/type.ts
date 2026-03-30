/**
 * Representa os dados do usuário no sistema.
*/


/**
 * Representa os dados do usuário.
*/
export type User = {
    id: number
    name: string
    cpf: string
    email: string
    rg?: string
    date_birth?: string
    contact?: string
}

export type Address = {
    contact: string
    address: string
    number: string
    neighborhood: string
    zip_code: string
    city: string
    state: string
}

/*
* Representa os dados específicos do despachante, que são adicionais aos dados do usuário.
*/
export type Dispatcher = {
    regis_crdd: string
    date_exp_regis: string
}

export type Office = {
    contact: string
    address: string
    number: string
    neighborhood: string
    zip_code: string
    city: string
    state: string
}

export type Profile = {
    photo: string
    instagram: string
    whatsapp: string
    website: string
}

/*
* Representa o perfil completo do despachante, incluindo dados do usuário, despachante, escritório e perfil.
*/
export type ProfileDispatcher = {
    user: User
    dispatcher: Dispatcher
    office: Office
    profile: Profile
}

/**
* Representa o perfil completo do cliente, incluindo dados do usuário.
*/
export type ProfileClient = {
    user: User
    address: Address
}

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
 * Representa os dados necessários para o login do usuário.
 */
export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    id: number
    name: string
    email: string
    role: "dispatcher" | "user"
    token: string
}

/**
 * Representa os dados de erro da API.
 */
export type ApiError = {
    message?: string
    description?: string
}
