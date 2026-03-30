import { searchDispatchers } from "@/services/search-dispatcher";
import type { SearchDispatchersParams } from "@/types/dispatcher.types";
import { useEffect, useState } from "react";


export function useSearchDispatchers(filters: SearchDispatchersParams) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDispatchers = async () => {
      try {
        setLoading(true);

        const result = await searchDispatchers(filters);        
        setData(result);
        
      } catch (error) {
        console.error("Erro ao buscar despachantes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDispatchers();
  }, [filters]);

  return { data, loading };
}
