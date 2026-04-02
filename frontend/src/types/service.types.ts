
/*
* Criar um serviço
*/
export type CreateServiceRequest = {
    name: string;
    description: string;
};

/* 
* Resposta do backend para um serviço
*/
export type ServiceResponse = {
    id: number;
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
};
