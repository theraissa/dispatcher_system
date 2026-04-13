import { createContext } from "react";

/**
 * Representa os dados do usuário.
*/
export type UserType = {
    id: number
    name: string
    cpf?: string
    email: string
    date_birth?: string
    contact?: string
    password?: string
    confirm_password?: string
}

/**
 * Representa os dados do endereço do usuário.
*/
export type Address = {
    id: number;
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
    id: number;
    regis_crdd: string
    date_exp_regis: string
}

/*
* Representa os dados específicos do escritório do despachante.
*/
export type Office = {
    id: number;
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
    id: number;
    photo: string
    instagram: string
    whatsapp: string
    website: string
}

/*
* Representa os dados específicos do serviço.
*/
export type Service = {
    id: number;
    name: string
    description: string
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export type RolePermission = {
    dispatcher: string;
    user: string;
    admin: string;
}

/**
 * Representa os dados necessários para o login do usuário.
 */
export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = UserContext & {
    token: string;
}

/**
 * Representa os dados de erro da API.
 */
export type ApiError = {
    message?: string
    description?: string
}

/**
 * Resposta padrão para mensagens do Flask
 */
export type MessageResponse = {
    message: string;
};


/**
 * 
 */
export type UserContext = {
    id: number;
    dispatcherId?: number;
    name: string;
    email: string;
    role: RolePermission
}

export type AuthContextType = {
    user: UserContext;
    token: string;
    isAuthenticated: boolean;
    signIn: (user: UserContext, token: string) => void;
    signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextType);
