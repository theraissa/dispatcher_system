import { TicketChat } from '@/components/called/called-details/chat-ticket';
import { InfoServiceAndUser } from "@/components/called/called-details/info-service-user-ticket";
import { TimelineTicket } from '@/components/called/called-details/timeline-ticket';
import { ReviewModal } from "@/components/called/modal/review-modal";
import { AsideProfileDispatcher } from '@/components/client/card-profile-dispatcher/aside-profile';
import { useAuthRequired } from '@/hooks/auth/auth-requirered';
import { useTickets } from "@/hooks/use-ticket";
import { useTicketReview } from "@/hooks/use-ticket-review";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import NavbarPage from "../../components/record/ui/navbar-page";


/**
 * Página de detalhes de um chamado (TicketDetails).
 *
 * Responsabilidades:
 * - Buscar os dados completos de um chamado pelo ID da rota
 * - Exibir informações detalhadas do serviço e do cliente
 * - Permitir comunicação via chat entre cliente e despachante
 * - Exibir informações do despachante responsável
 * - Exibir timeline do chamado (status/histórico)
 *
 * Fluxo:
 * 1. Obtém `ticketId` via params da URL
 * 2. Busca os dados do chamado via hook `useTickets`
 * 3. Renderiza estados:
 *    - Loading
 *    - Não encontrado
 *    - Conteúdo completo
 *
 * Componentes envolvidos:
 * - InfoServiceAndUser → Dados do chamado + cliente
 * - TicketChat → Chat entre cliente e despachante
 * - AsideProfileDispatcher → Perfil do despachante
 * - TimelineTicket → Histórico do chamado
 */
export default function TicketDetails() {

    // Usuário autenticado
    const { user } = useAuthRequired();

    // ID do chamado vindo da rota (/called-details/:ticketId)
    const { ticketId } = useParams();

    // Hook responsável por gerenciar tickets
    const { selectedTicket, loading, fetchTicketById } = useTickets(user.id);

    // Controla a abertura/fechamento do modal de avaliação.
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // Hook responsável por enviar a avaliação do atendimento.
    const { loading: reviewLoading, handleSubmit } = useTicketReview(
        Number(ticketId),
        user.id
    );

    console.log(ticketId)

    /**
     * Efeito responsável por buscar os dados do chamado
     * sempre que o `ticketId` mudar.
     */
    useEffect(() => {
        if (!ticketId) return;

        fetchTicketById(Number(ticketId));
    }, [ticketId]);

    /**
     * Manipula o envio da avaliação do usuário.
     */
    async function handleReviewSubmit(data: { rating: number; comment?: string }) {
        try {
            await handleSubmit(data);

            toast.success("Avaliação enviada com sucesso!");
            setIsReviewOpen(false);

        } catch (err: any) {
            toast.error(err.message);
        }
    }

    // Estado de carregamento do ticket.
    if (loading) {
        return <p className="text-center mt-10">Carregando o chamado...</p>;
    }

    // Estado em que o ticket não foi encontrado.
    if (!selectedTicket) {
        return <p className="text-center mt-10">Chamado não encontrado.</p>;
    }

    /**
     * Adapta estrutura do dispatcher para o formato esperado
     * pelo componente AsideProfileDispatcher.
     */
    const dispatcherProfile = {
        user: {
            name: selectedTicket.dispatcher.name,
            email: selectedTicket.dispatcher.email,
        },
        office: {
            contact: selectedTicket.dispatcher.contact,
            address: selectedTicket.dispatcher.address,
            city: selectedTicket.dispatcher.city,
            state: selectedTicket.dispatcher.state,
            number: selectedTicket.dispatcher.number,
            neighborhood: selectedTicket.dispatcher.neighborhood,
        }
    };

    return (
        <div className="min-h-screen bg-[#F3EDE2]">

            {/* Navbar principal da área do cliente */}
            <NavbarPage
                title="Central do Cliente"
                shortTitle="C"
                links={clientLinksNavbar}
            />

            <main className="max-w-6xl mx-auto py-6 md:py-10 px-4 md:px-6">

                {/* =========================
                   HEADER DO CHAMADO
                   ========================= */}
                <header className="mb-8 md:mb-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-[#1E1E1E] tracking-tight">
                                Detalhes do{" "}
                                <span className="text-[#21314D]">
                                    Chamado #{selectedTicket.id}
                                </span>
                            </h1>

                            <p className="text-zinc-500 text-base md:text-lg font-medium mt-2 max-w-2xl">
                                Acompanhe o progresso do serviço de{" "}
                                <span className="font-bold text-[#1E1E1E]">
                                    {selectedTicket.service_details.name}
                                </span>.
                            </p>
                        </div>
                    </div>
                </header>

                {/* =========================
                   LAYOUT PRINCIPAL (GRID)
                   ========================= */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 md:gap-8">

                    {/* COLUNA PRINCIPAL */}
                    <div className="space-y-6 md:space-y-8">
                        {/* Informações do serviço + cliente */}
                        <InfoServiceAndUser ticket={selectedTicket} />

                        {/* Timeline do chamado */}
                        <TimelineTicket ticketId={Number(ticketId)} />

                        {/* Chat do chamado */}
                        <TicketChat
                            userId={user.id}
                            ticket={selectedTicket}
                        />
                    </div>


                    {/* =========================
                       SIDEBAR (COLUNA DIREITA)
                       ========================= */}
                    <aside className="space-y-6 md:space-y-8 lg:sticky lg:top-10 self-start h-fit">

                        {/* Perfil do despachante */}
                        <AsideProfileDispatcher
                            dispatcher={dispatcherProfile}
                            onOpenReview={() => setIsReviewOpen(true)}
                            canReview={true}
                        />

                        {/* Modal para avaliar o despachante */}
                        <ReviewModal
                            isOpen={isReviewOpen}
                            onClose={() => setIsReviewOpen(false)}
                            onSubmit={handleReviewSubmit}
                            loading={reviewLoading}
                        />
                    </aside>
                </div>
            </main>
        </div>
    );
}
