
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



/* 
* Representa os dados de um serviço, incluindo o preço definido pelo despachante
*/
export type ServiceDetail = {
    id: number
    name: string
    price?: number
}
