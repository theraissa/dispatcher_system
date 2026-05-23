import type { Address, CreateAddress, CreateDispatcher, CreateUserType, Dispatcher, UserType } from "./type";


/**
 * Formulário de cadastro de despachante (frontend).
 */
export type RegisterDispatcherRequest = {
  user: CreateUserType;
  dispatcher: CreateDispatcher;
  address: CreateAddress;
}

/**
 * Representa a resposta da API ao criar um despachante.
 */
export type RegisterDispatcherResponse = {
  user_id: number
  dispatcher_id: number
  address_id: number
}

/*
* Representa o perfil completo do despachante, incluindo dados do usuário, despachante, escritório e perfil.
*/
export type ProfileDispatcher = {
  user: UserType
  dispatcher: Dispatcher
  address: Address
}
