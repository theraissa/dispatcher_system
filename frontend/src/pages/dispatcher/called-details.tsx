import NavbarPage from "../../components/record/ui/navbar-page";
import { dispatcherLinksNavbar } from "@/routes/frontend-routes";
import { useAuth } from '@/hooks/use-auth';
import { AsideProfileDispatcher } from '@/components/client/card-profile-dispatcher/aside-profile';
import { TimelineTicket } from '@/components/called/called-details/timeline-ticket';
import { useTickets } from "@/hooks/use-ticket";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TicketChat } from '@/components/called/called-details/chat-ticket';
import { InfoServiceAndUser } from "@/components/called/called-details/info-service-user-ticket";
import { useTicketReview } from "@/hooks/use-ticket-review";
import { ReviewModal } from "@/components/called/modal/review-modal";
import { toast } from "sonner";



export default function TicketDetailsDispatcher() {

    // Usuário autenticado
    const { user } = useAuth();

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

            {/* Navbar */}
            <NavbarPage
                title="Central do Despachante"
                shortTitle="D"
                links={dispatcherLinksNavbar}
            />

            <main className="max-w-6xl mx-auto py-10 px-6">

                {/* =========================
                   HEADER DO CHAMADO
                   ========================= */}
                <header className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E1E1E] tracking-tight">
                                Detalhes do{" "}
                                <span className="text-[#21314D]">
                                    Chamado #{selectedTicket.id}
                                </span>
                            </h1>

                            <p className="text-zinc-500 text-sm md:text-base font-medium mt-2 max-w-2xl">
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
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

                    {/* COLUNA PRINCIPAL */}
                    <div className="space-y-8">

                        {/* Informações do serviço + cliente */}
                        <InfoServiceAndUser ticket={selectedTicket} />

                        {/* Timeline do chamado */}
                        <TimelineTicket
                            ticketId={Number(ticketId)}
                            isDispatcher={true}
                        />

                        {/* Chat do chamado */}
                        <TicketChat
                            userId={user.id}
                            ticket={selectedTicket}
                        />
                    </div>


                    {/* =========================
                       SIDEBAR (COLUNA DIREITA)
                       ========================= */}
                    <aside className="space-y-8 sticky top-10 self-start h-fit">

                        {/* Perfil do despachante */}
                        <AsideProfileDispatcher
                            dispatcher={dispatcherProfile}
                            onOpenReview={() => setIsReviewOpen(true)}
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
