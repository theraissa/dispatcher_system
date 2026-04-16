/**
 * Reflete o ServiceResponse (BaseModel) do Pydantic
 */
export type ServiceResponse = {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
};

/**
 * Reflete o CreateServiceRequest do Pydantic
 */
export type CreateServiceRequest = {
    name?: string;
    description?: string;
};

/**
 * Reflete o retorno do método get_services_from_dispatcher
 */
export type ServiceDetails = {
    id: number;
    service_id: number;
    name: string;
    price?: number;
};
