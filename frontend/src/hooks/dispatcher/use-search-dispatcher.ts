import { dispatcherService } from "@/services/dispatcher-service";
import type { ProfileDispatcher } from "@/types/dispatcher.types";
import { useEffect, useState } from "react";


/**
 * Hook responsável por buscar despachantes com base em uma query.
 *
 * Regras:
 * - Executa busca sempre que a query muda
 * - Não executa se a query estiver vazia
 * - Mantém estado de loading
 *
 * @param query Texto de busca digitado pelo usuário
 */
export function useSearchDispatchers(query: string) {
  const [data, setData] = useState<ProfileDispatcher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDispatchers = async () => {
      try {
        setLoading(true);

        // Se não houver query, busca dados iniciais
        const result = await dispatcherService.searchDispatchers(query || "");

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
