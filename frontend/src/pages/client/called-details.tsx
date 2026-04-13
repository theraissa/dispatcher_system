import NavbarPage from "../../components/record/ui/navbar-page";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { useAuth } from '@/hooks/use-auth';
import { AsideProfileDispatcher } from '@/components/client/card-profile-dispatcher/aside-profile';
import { TimelineTicket } from '@/components/client/called-details/timeline-ticket';
import { useTickets } from "@/hooks/use-ticket";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { TicketChat } from '@/components/client/called-details/chat-ticket';
import { InfoServiceAndUser } from "@/components/client/called-details/info-service-user-ticket";


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
    const { user } = useAuth();

    // ID do chamado vindo da rota (/called-details/:ticketId)
    const { ticketId } = useParams();

    // Hook responsável por gerenciar tickets
    const { selectedTicket, loading, fetchTicketById } = useTickets(user.id);

    // EFEITO: BUSCAR CHAMADO
    useEffect(() => {
        if (!ticketId) return;

        // Converte string da URL para número
        fetchTicketById(Number(ticketId));

    }, [ticketId]);


    if (loading) {
        return <p className="text-center mt-10">Carregando o chamado...</p>;
    }
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

            <main className="max-w-6xl mx-auto py-10 px-6">

                {/* =========================
                   HEADER DO CHAMADO
                   ========================= */}
                <header className="mb-12">
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
                        <AsideProfileDispatcher dispatcher={dispatcherProfile} />

                        {/* Timeline do chamado */}
                        <TimelineTicket />
                    </aside>
                </div>
            </main>
        </div>
    );
}
