import { useState, useEffect } from "react";
import { adminService } from "../services/admin-service";

export function useAdminDispatchers() {
    const [dispatchers, setDispatchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadDispatchers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getPendingDispatchers();
            setDispatchers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDispatchers(); }, []);

    const approve = async (id: number) => {
        await adminService.approveDispatcher(id);
        setDispatchers(prev => prev.filter(d => d.id !== id));
    };

    const reject = async (id: number) => {
        await adminService.rejectDispatcher(id);
        setDispatchers(prev => prev.filter(d => d.id !== id));
    };

    return { dispatchers, loading, approve, reject, refresh: loadDispatchers };
}
