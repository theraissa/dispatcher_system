import { TicketChat } from '@/components/called/called-details/chat-ticket';
import { InfoServiceAndUser } from "@/components/called/called-details/info-service-user-ticket";
import { TimelineTicket } from '@/components/called/called-details/timeline-ticket';
import { ReviewModal } from "@/components/called/modal/review-modal";
import { AsideProfileDispatcher } from '@/components/client/card-profile-dispatcher/aside-profile';
import { FeedbackState } from '@/components/record/ui/feedback-state';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthRequired } from '@/hooks/auth/auth-requirered';
import { useTickets } from "@/hooks/ticket/use-ticket";
import { useTicketReview } from "@/hooks/ticket/use-ticket-review";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { ClipboardX } from "lucide-react";
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
    const [initialRating, setInitialRating] = useState(0); // <-- Novo estado

    // Hook responsável por enviar a avaliação do atendimento.
    const { loading: reviewLoading, handleSubmit } = useTicketReview(
        Number(ticketId),
        user.id
    );

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
        return <TicketDetailsSkeleton />;
    }

    // Estado em que o ticket não foi encontrado.
    if (!selectedTicket) {
        return (
            <FeedbackState
                title="Chamado inexistente"
                description="O número do chamado informado não consta em nossa base de dados."
                icon={ClipboardX}
                buttonText="Ver meus chamados"
            />
        );
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
                            onOpenReview={(rating) => {
                                setInitialRating(rating);
                                setIsReviewOpen(true);
                            }}
                            canReview={true}
                        />

                        {/* Modal para avaliar o despachante */}
                        <ReviewModal
                            isOpen={isReviewOpen}
                            initialRating={initialRating}
                            onClose={() => {
                                setIsReviewOpen(false);
                                setInitialRating(0);
                            }}
                            onSubmit={handleReviewSubmit}
                            loading={reviewLoading}
                        />
                    </aside>
                </div>
            </main>
        </div>
    );
}

export function TicketDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            {/* Navbar Placeholder */}
            <div className="w-full h-[60px] bg-[#21314D]" />

            <main className="max-w-6xl mx-auto py-6 md:py-10 px-4 md:px-6">
                {/* HEADER SKELETON */}
                <header className="mb-8 md:mb-12">
                    <Skeleton className="h-10 w-64 md:w-96 mb-4" />
                    <Skeleton className="h-5 w-full max-w-md" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 md:gap-8">

                    {/* COLUNA PRINCIPAL (ESQUERDA) */}
                    <div className="space-y-6 md:space-y-8">

                        {/* InfoServiceAndUser Skeleton */}
                        <section className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm space-y-4">
                            <Skeleton className="h-8 w-48 mb-6" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            </div>
                        </section>

                        {/* Timeline Skeleton */}
                        <section className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm">
                            <Skeleton className="h-7 w-40 mb-8" />
                            <div className="space-y-8 ml-4 border-l-2 border-zinc-100 pl-8 relative">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-zinc-200 border-4 border-white" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Chat Skeleton */}
                        <section className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm h-[400px] flex flex-col">
                            <Skeleton className="h-7 w-32 mb-6" />
                            <div className="flex-1 space-y-4 overflow-hidden">
                                <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tl-none bg-zinc-100" />
                                <Skeleton className="h-12 w-1/2 rounded-2xl rounded-tr-none bg-zinc-200 ml-auto" />
                                <Skeleton className="h-16 w-3/4 rounded-2xl rounded-tl-none bg-zinc-100" />
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Skeleton className="h-12 flex-1 rounded-xl" />
                                <Skeleton className="h-12 w-12 rounded-xl" />
                            </div>
                        </section>
                    </div>

                    {/* SIDEBAR (DIREITA) */}
                    <aside className="space-y-6 md:space-y-8">
                        {/* Reutilizando a lógica do esqueleto do AsideProfile que fizemos antes */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-zinc-100 border-t-[6px] border-t-zinc-200">
                            <Skeleton className="w-24 h-24 rounded-[24px] mx-auto mb-6" />
                            <div className="flex flex-col items-center gap-3 mb-8">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
