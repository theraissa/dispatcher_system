
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
    deleted_at?: string;
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
    name_dispatcher?: string | null;
    name_client?: string | null;
    created_at: string;
    deleted_at?: string;
}

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

/*
* Informações que contém na review do chamado.
*/
export type TicketReview = {
    id: number;
    ticket_id: number;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}
// Tipo para resposta da listagem de reviews do chamado.
export type ListTicketReview = TicketReview[]

/*
* Informações que contém na média do review.
*/
export type TicketReviewSummary = {
    average_rating: number;
    total_reviews: number;
}


/*
* Informações necessárias para criar um timeline para o chamado.
*/
export type CreateTimelineRequest = {
    description: string;
    status: string;
}
/*
* Informações que contém no timeline do chamado.
*/
export type TimelineResponse = {
    id: number;
    status: string;
    description: string;
    action_by?: number;
    created_at: string;
}

// Tipo para resposta da listagem de timeline do chamado.
export type ListTimelineResponse = TimelineResponse[]


/**
 * Meios de buscar o chamado.
 */
export type TicketFilters = {
    search?: string;
    id?: string;
    date?: string;
    state?: string;
};



/**
 * Informações sobre o rendimento mensal do despachante.
 * Contendo informações sobre quantidades de tickets foram resolvidos...
 */
export type TicketStatisticsDispatcher = {
    pending: number;
    in_progress: number;
    finished_month: number;
    monthly_revenue: number;
}
