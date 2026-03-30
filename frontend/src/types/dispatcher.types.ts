/**
 * Formulário de cadastro de despachante (frontend).
 */
export interface RegisterDispatcherRequest {
  user: {
    name: string
    cpf: string
    rg: string
    date_birth: string
    contact: string
    email: string
    password: string
    confirm_password: string
  }

  dispatcher: {
    regis_crdd: string
    date_exp_regis: string
  }

  office: {
    address: string
    number: string
    neighborhood: string
    zip_code: string
    city: string
    state: string
    contact: string
  }
}

/**
 * Parâmetros para busca de despachantes (frontend).
 */
export type SearchDispatchersParams = {
  name?: string;
  city?: string;
  service?: string;
};
