import { useEffect, useState } from "react";
import {
    getReviewSummaryDispatcher,
    listReviewsDispatcher
} from "@/services/ticket-service";

import type {
    ListTicketReview,
    TicketReviewSummary
} from "@/types/ticket.types";

/**
 * Hook responsável por buscar e gerenciar avaliações de um despachante.
 *
 * Responsabilidades:
 * - Buscar lista de avaliações
 * - Buscar resumo das avaliações (média, total, etc.)
 * - Controlar estados de loading independentes
 *
 * @param userId ID do usuário (despachante)
 */
export function useDispatcherReviews(userId: number) {

    // --- ESTADOS DE DADOS ---
    const [reviews, setReviews] = useState<ListTicketReview>([]);
    const [summary, setSummary] = useState<TicketReviewSummary | null>(null);

    // --- LOADING SEPARADO ---
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);

    /**
     * Busca todas as avaliações do despachante.
     */
    async function fetchReviews() {
        if (!userId) return;

        try {
            setLoadingReviews(true);
            const data = await listReviewsDispatcher(userId);
            setReviews(data);
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
        } finally {
            setLoadingReviews(false);
        }
    }

    /**
     * Busca o resumo das avaliações (média, total, etc.).
     */
    async function fetchSummary() {
        if (!userId) return;

        try {
            setLoadingSummary(true);
            const data = await getReviewSummaryDispatcher(userId);
            setSummary(data);
        } catch (error) {
            console.error("Erro ao buscar resumo:", error);
        } finally {
            setLoadingSummary(false);
        }
    }

    /**
     * Carrega dados iniciais automaticamente.
     */
    useEffect(() => {
        if (!userId) return;

        fetchReviews();
        fetchSummary();
    }, [userId]);

    return {
        // dados
        reviews,
        summary,

        // estados
        loadingReviews,
        loadingSummary,

        // ações
        fetchReviews,
        fetchSummary,
    };
}
