/**
 * Representa os dados do usuário no sistema.
*/

export interface User {
    id: number
    name: string
    cpf: string
    email: string
    rg?: string
    date_birth?: string
    contact?: string
}

export interface Dispatcher {
    regis_crdd: string
    date_exp_regis: string
}

export interface Office {
    contact: string
    address: string
    number: string
    neighborhood: string
    zip_code: string
    city: string
    state: string
}

export interface Profile {
    photo: string
    instagram: string
    whatsapp: string
    website: string
}

export interface ProfileDispatcher {
    user: User
    dispatcher: Dispatcher
    office: Office
    profile: Profile
}


/**/
export interface CreateUserRequest {
    name: string
    cpf: string
    email: string
    password: string
}


/**/
export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    id: number
    name: string
    email: string
    role: "dispatcher" | "user"
    token: string
}

/**/
export interface ApiError {
    message?: string
    description?: string
}
