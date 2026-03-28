import { useEffect, useState } from "react"
import {
    getDispatcherServices,
    getAllServices,
    removeDispatcherService,
    addDispatcherService,
    updateDispatcherService
} from "../services/profile-service"

type Service = {
    id: number
    name: string
    price?: number
}

export function useProfileServices(userId: number) {
    const [services, setServices] = useState<Service[]>([])
    const [allServices, setAllServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchData() {
        const [userServices, globalServices] = await Promise.all([
            getDispatcherServices(userId),
            getAllServices()
        ])

        setServices(userServices)
        setAllServices(globalServices)
    }

    useEffect(() => {
        if (!userId) return

        fetchData().finally(() => setLoading(false))
    }, [userId])

    async function removeService(serviceId: number) {
        await removeDispatcherService(userId, serviceId)

        setServices(prev => prev.filter(s => s.id !== serviceId))
    }

    async function addServices(newServices: Service[]) {
        await Promise.all(
            newServices.map(service =>
                addDispatcherService(userId, service.id)
            )
        )

        setServices(prev => [...prev, ...newServices])
    }

    async function updateService(serviceId: number, price: number) {
        await updateDispatcherService(userId, serviceId, price)

        setServices(prev =>
            prev.map(s =>
                s.id === serviceId ? { ...s, price } : s
            )
        )
    }

    return {
        services,
        allServices,
        loading,
        removeService,
        addServices,
        updateService
    }
}
