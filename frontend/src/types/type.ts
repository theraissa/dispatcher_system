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
    password?: string
    confirm_password?: string
}

/**
 * Representa os dados do endereço do usuário.
*/
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
* Representa os dados específicos do despachante.
*/
export type Dispatcher = {
    regis_crdd: string
    date_exp_regis: string
}

/*
* Representa os dados específicos do escritório do despachante.
*/
export type Office = {
    contact: string
    address: string
    number: string
    neighborhood: string
    zip_code: string
    city: string
    state: string
}

/*
* Representa os dados específicos do perfil do despachante.
*/
export type Profile = {
    photo: string
    instagram: string
    whatsapp: string
    website: string
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
