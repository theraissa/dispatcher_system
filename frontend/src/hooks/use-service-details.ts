import { serviceDetailsDispatcher } from "@/services/service-details";
import type { AssociateServiceDetailsResponse, ServiceDetails, ServiceResponse } from "@/types/service.types";
import type { PaginatedResponse } from "@/types/type";
import { useCallback, useEffect, useState } from "react";


type PaginationMetadata = Omit<PaginatedResponse<AssociateServiceDetailsResponse>, "items">;

/**
 * Hook personalizado para gerenciar os serviços do perfil do despachante.
 */
export function useServiceDetails(dispatcherId: number) {
    const [serviceDetails, setServiceDetails] = useState<AssociateServiceDetailsResponse[]>([])
    const [allServices, setAllServices] = useState<ServiceResponse[]>([])
    const [loading, setLoading] = useState(true)

    const [pagination, setPagination] = useState<PaginationMetadata>({
        page: 1,
        per_page: 10,
        total: 1,
        pages: 1,
    })

    const fetchData = useCallback(async (page: number = 1, per_page: number = 10) => {
        setLoading(true);
        try {
            const [details, catalog] = await Promise.all([
                serviceDetailsDispatcher.getServiceDetailsDispatcher(dispatcherId, page, per_page),
                serviceDetailsDispatcher.getAllServices()
            ]);
            setServiceDetails(details.items);
            setPagination({
                page: details.page,
                per_page: details.per_page,
                total: details.total,
                pages: details.pages,
            });

            setAllServices(catalog);
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatcherId]);

    useEffect(() => {
        if (!dispatcherId) return;
        fetchData(1);
    }, [dispatcherId, fetchData]);

    async function createServiceDetails(newServices: ServiceDetails[]) {
        await Promise.all(
            newServices.map(service =>
                serviceDetailsDispatcher.createServiceDetailsDispatcher(dispatcherId, service.id)
            )
        )
        fetchData(pagination.page);
    }

    async function updateServiceDetails(serviceId: number, price: number) {
        await serviceDetailsDispatcher.updateServiceDetailsDispatcher(dispatcherId, serviceId, price);
        setServiceDetails(prev =>
            prev.map(s => s.service_id === serviceId ? { ...s, price } : s)
        )
    }

    async function removeServiceDetails(serviceId: number) {
        await serviceDetailsDispatcher.removeDispatcherServiceDetails(dispatcherId, serviceId)

        if (serviceDetails.length === 1 && pagination.page > 1) {
            fetchData(pagination.page - 1)
        } else {
            fetchData(pagination.page);
        }
    }

    return {
        serviceDetails,
        allServices,
        loading,
        pagination,
        fetchData,
        createServiceDetails,
        updateServiceDetails,
        removeServiceDetails,
    }
}
