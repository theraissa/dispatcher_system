import { serviceDetailsDispatcher } from "@/services/service-details"
import type { AssociateServiceDetailsResponse, ServiceDetails, ServiceResponse } from "@/types/service.types"
import { useCallback, useEffect, useState } from "react"


/**
 * Hook personalizado para gerenciar os serviços do perfil do despachante.
 */
export function useServiceDetails(dispatcherId: number) {

    const [serviceDetails, setServiceDetails] = useState<AssociateServiceDetailsResponse[]>([])
    const [allServices, setAllServices] = useState<ServiceResponse[]>([])
    const [loading, setLoading] = useState(true)

    // Função que busca dados do servidor e guarda nos 'estados' acima
    const fetchData = useCallback(async () => {
        setLoading(true); // Começa o carregamento
        try {
            const [details, catalog] = await Promise.all([
                serviceDetailsDispatcher.getServiceDetailsDispatcher(dispatcherId),
                serviceDetailsDispatcher.getAllServices()
            ]);
            setServiceDetails(details.items);
            setAllServices(catalog);
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatcherId]);

    useEffect(() => {
        if (!dispatcherId) return;
        fetchData();
    }, [dispatcherId, fetchData]);

    // Função para criar um serviço detalhado para o despachante.
    async function createServiceDetails(newServices: ServiceDetails[]) {
        await Promise.all(
            newServices.map(service =>
                serviceDetailsDispatcher.createServiceDetailsDispatcher(dispatcherId, service.id)
            )
        )
        fetchData(); // Recarrega a lista após criar
    }

    // Função para atualizar o serviço detalhado do despachante.
    async function updateServiceDetails(serviceId: number, price: number) {
        await serviceDetailsDispatcher.updateServiceDetailsDispatcher(dispatcherId, serviceId, price);

        // Isso aqui atualiza a lista na tela SEM precisar recarregar do banco:
        setServiceDetails(prev =>
            prev.map(s =>
                s.service_id === serviceId
                    ? { ...s, price }
                    : s
            )
        )
    }

    // Função para remover o serviço detalhado do despachante
    async function removeServiceDetails(serviceId: number) {
        await serviceDetailsDispatcher.removeDispatcherServiceDetails(dispatcherId, serviceId)

        // Isso remove o item da sua lista local instantaneamente para o usuário
        setServiceDetails(prev => prev.filter(s => s.service_id !== serviceId))
    }

    return {
        serviceDetails,
        allServices,
        loading,
        createServiceDetails,
        updateServiceDetails,
        removeServiceDetails,
    }
}
