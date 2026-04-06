import type { Dispatcher, Office, Profile, User } from "./type"


/**
 * Formulário de cadastro de despachante (frontend).
 */
export type RegisterDispatcherRequest = {
  user: User
  dispatcher: Dispatcher
  office: Office
}

/**
 * Representa a resposta da API ao criar um despachante.
 */
export type RegisterDispatcherResponse = {
  user_id: number
  dispatcher_id: number
  office_id: number
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
