/*
* Informações básicas do despachnate que retornam da 
* rota de listagem admin.
*/
export type DispatcherAdmin = {
    id: number;
    name: string;
    email: string;
};


// Tipo para a resposta de listagem de despachantes do admin.
export type ListDispatcherAdmin = DispatcherAdmin[];

// Tipo para o status do cadastro do despachante.
export type StatusType = "aprovado" | "negado" | "pendente"
