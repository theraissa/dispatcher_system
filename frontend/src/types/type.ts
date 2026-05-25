import { createContext } from "react";

/**
 * Representa os dados do usuário.
*/
export type UserType = {
    id: number;
    name: string;
    cpf?: string;
    email: string;
    date_birth?: string;
    contact?: string;
    password?: string;
    confirm_password?: string;
    photo?: string
    instagram?: string
    website?: string
}
export type CreateUserType = {
    name: string;
    cpf?: string;
    email: string;
    date_birth?: string;
    contact?: string;
    password?: string;
    confirm_password?: string;
}

/**
 * Representa os dados do endereço do usuário.
*/
export type Address = {
    id: number;
    contact: string;
    address: string;
    number: string;
    neighborhood: string;
    zip_code: string;
    city: string;
    state: string;
}
export type CreateAddress = {
    contact: string;
    address: string;
    number: string;
    neighborhood: string;
    zip_code: string;
    city: string;
    state: string;
}

/*
* Representa os dados específicos do despachante.
*/
export type Dispatcher = {
    id: number;
    regis_crdd: string;
    date_exp_regis: string;
}
export type CreateDispatcher = {
    regis_crdd: string;
    date_exp_regis: string;
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

export type RolePermission = "despachante" | "cliente" | "admin"

/**
 * Representa os dados necessários para o login do usuário.
 */
export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = UserContext & {
    dispatcher_id?: number;
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
 * Dados do usuário obtindo pelo contexto da requisição
 */
export type UserContext = {
    id: number;
    dispatcherId?: number;
    name: string;
    email: string;
    role: RolePermission
}

export type AuthContextType = {
    user: UserContext | null;
    token: string | null;
    isAuthenticated: boolean;
    signIn: (user: UserContext, token: string) => void;
    signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

/**
 * Estrutura genérica de respostas paginadas da API.
 *
 * @template T Tipo dos itens retornados.
 */
export interface PaginatedResponse<T> {
    // Lista de itens da página atual.
    items: T[];
    // Quantidade total de registros.
    total: number;
    // Página atual.
    page: number;
    // Quantidade de páginas.
    pages: number
    // Quantidade de itens por página.
    per_page: number;
}
