
/*
* Criar um chamado.
*/
export type CreateTicketRequest = {
    user_id: number;
    dispatcher_id: number;
    service_details_id: number;
}

/*
* Informações do Ticket.
*/
export type TicketUserResponse = {
    id: number;
    status: string;
    user: UserInfoTicket;
    dispatcher: DispatcherInfoTicket;
    service_details: ServiceDetailsInfoTicket;
    created_at: string;
};

/*
* Informações do usuário/cliente que estão presente no Ticket.
*/
export type UserInfoTicket = {
    name: string;
    email: string;
    contact: number;
    cpf: string;
    address: string;
    city: string;
    state: string;
    zip_code: number;
    number: number;
    neighborhood: string;
}

/*
* Informações do despachante que estão presente no Ticket.
*/
export type DispatcherInfoTicket = {
    name: string;
    email: string;
    contact: number;
    address: string;
    city: string;
    state: string;
    number: number;
    neighborhood: string;
}

/*
* Informações do serviço que estão presente no Ticket.
*/
export type ServiceDetailsInfoTicket = {
    id: number;
    price: number;
    service_id: number;
    name: string;
    description: string;
}

/*
* Informações do básicas do Ticket que retornam da rota de listagem.
*/
export type ListTicketResponse = {
    id: number;
    status: string;
    name_service: string;
    name_dispatcher: string;
    created_at: string;
}

// Tipo para a resposta da listagem de chamados do usuário.
export type ListTicketUserResponse = ListTicketResponse[];


/*
* Informações que contém na mensagem do chamado.
*/
export type TicketMessage = {
    id: number;
    user_id: number;
    message: string;
    created_at: string;
}

// Tipo para resposta da listagem de mensagem do chamado.
export type ListTicketMessage = TicketMessage[]
