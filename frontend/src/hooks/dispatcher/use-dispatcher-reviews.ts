import { ticketService } from "@/services/ticket-service";
import type { ListTicketReview, TicketReviewSummary } from "@/types/ticket.types";
import { useEffect, useState } from "react";

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

    const [updatingReview, setUpdatingReview] = useState(false);

    /**
     * Busca todas as avaliações do despachante.
     */
    async function fetchReviews() {
        if (!userId) return;

        try {
            setLoadingReviews(true);
            const data = await ticketService.listReviewsDispatcher(userId);
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
            const data = await ticketService.getReviewSummaryDispatcher(userId);
            setSummary(data);
        } catch (error) {
            console.error("Erro ao buscar resumo:", error);
        } finally {
            setLoadingSummary(false);
        }
    }

    /**
     * Atualiza um Review
     */
    async function updateReview(
        ticketId: number,
        reviewId: number,
        data: {
            rating: number;
            comment?: string;
        }
    ) {
        try {
            setUpdatingReview(true);

            await ticketService.updateReview(
                ticketId,
                reviewId,
                data
            );

            // recarrega avaliações
            await fetchReviews();

            // atualiza resumo
            await fetchSummary();

        } catch (error) {
            console.error("Erro ao atualizar avaliação:", error);
        } finally {
            setUpdatingReview(false);
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
        reviews,
        summary,

        loadingReviews,
        loadingSummary,
        updatingReview,

        fetchReviews,
        fetchSummary,
        updateReview,
    };
}
