import { searchDispatchers } from "@/services/search-dispatcher";
import { useEffect, useState } from "react";


/**
 * Hook personalizado para buscar despachantes com base em uma query de pesquisa.
 */
export function useSearchDispatchers(query: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    // Função assíncrona para buscar os despachantes com base na query
    const fetchDispatchers = async () => {
      try {
        setLoading(true);

        const result = await searchDispatchers(query);
        setData(result);

      } catch (error) {
        console.error("Erro ao buscar despachantes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDispatchers();
  }, [query]);

  return { data, loading };
}
