import CalledContainer from "@/components/called/called-container";
import CalledClientFilter from "@/components/called/called-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthRequired } from "@/hooks/auth/auth-requirered";
import { useTickets } from "@/hooks/ticket/use-ticket";
import { clientLinksNavbar, FRONTEND_ROUTES } from "@/routes/frontend-routes";
import type { TicketFilters } from "@/types/ticket.types";
import { formatToInputDate } from "@/utils/formatters";
import { useState } from "react";
import NavbarPage from "../../components/record/ui/navbar-page";


/**
 * Página responsável por exibir e gerenciar os chamados do cliente.
 *
 * Responsabilidades:
 * - Buscar os chamados do usuário autenticado
 * - Permitir filtragem dos chamados (por texto, ID e data)
 * - Exibir lista de chamados filtrados
 * - Integrar componentes de layout (Navbar, Filtro e Container)
 * 
 * @returns Página completa com listagem e filtros de chamados do cliente
 */
export default function CalledClient() {

    // Usuário autenticado (necessário para buscar os chamados)
    const { user } = useAuthRequired();

    // Hook responsável por buscar os chamados do usuário
    const { tickets, loading } = useTickets(user?.id);

    // Estado que armazena os filtros definidos pelo usuário
    const [filters, setFilters] = useState<TicketFilters>({});

    /**
     * Atualiza os filtros recebidos do componente de busca.
     * Esse método é chamado pelo CalledClientFilter.
     */
    function handleSearch(newFilters: TicketFilters) {
        setFilters(newFilters);
    }

    /**
     * Aplica os filtros sobre a lista de chamados.).
     */
    const filteredTickets = tickets.filter(ticket => {
        return (
            // Busca por texto (nome do serviço)
            (!filters.search ||
                ticket.name_service
                    ?.toLowerCase()
                    .includes(filters.search.toLowerCase())) &&

            // Filtro por ID
            (!filters.id || ticket.id === Number(filters.id)) &&

            // Filtro por data (normalizada para input type="date")
            (!filters.date ||
                formatToInputDate(ticket.created_at) === filters.date)
        );
    });


    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            {/* Navbar principal da página */}
            <NavbarPage
                title="Central do Cliente"
                shortTitle="C"
                links={clientLinksNavbar}
            />

            <main className="max-w-6xl mx-auto py-8 md:py-10 px-4 md:px-6">
                {/* Cabeçalho da página */}
                <header className="mb-8 md:mb-10 text-center sm:text-left">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
                        Seus <span className="text-[#21314D]">Chamados</span>
                    </h1>
                    <p className="text-zinc-500 text-xs md:text-sm font-medium mt-1">
                        Acompanhe em tempo real o status das suas solicitações.
                    </p>
                </header>

                {/* Componente de filtros (emite os critérios de busca) */}
                <CalledClientFilter onSearch={handleSearch} />

                {/* Lista de chamados já filtrados */}
                <div className="mt-6 md:mt-8 transition-opacity duration-300">
                    {loading ? (
                        <CalledSkeleton />
                    ) : (
                        <CalledContainer
                            tickets={filteredTickets}
                            detailsRoute={FRONTEND_ROUTES.CLIENT.TICKET_DETAILS}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

function CalledSkeleton() {
    return (
        <div className="space-y-4 w-full">
            {[1, 2, 3, 4].map((n) => (
                <div
                    key={n}
                    className="flex items-center justify-between p-4 md:p-5 rounded-[24px] border border-zinc-100 bg-white"
                >
                    <div className="flex items-center gap-3 md:gap-4 w-full">
                        {/* ID box - Simula o número do chamado */}
                        <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shrink-0" />

                        {/* Textos - Nome do serviço e informações secundárias */}
                        <div className="space-y-2 w-full max-w-[150px] md:max-w-xs">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    </div>

                    {/* Lado direito (Status/Data/Botão) */}
                    <div className="hidden sm:flex items-center gap-4 md:gap-8 shrink-0">
                        {/* Data e Valor (se houver) */}
                        <div className="space-y-2 flex flex-col items-end">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-24" />
                        </div>

                        {/* Badge de Status (Pendente, Concluído, etc) */}
                        <Skeleton className="w-24 h-9 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
