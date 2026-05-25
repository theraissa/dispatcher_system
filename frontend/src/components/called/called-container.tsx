import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { ListTicketResponse } from "@/types/ticket.types";
import type { PaginatedResponse } from "@/types/type";
import { formatDate } from "@/utils/formatters";
import { AlertCircle, CheckCircle2, Clock, PlayCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type PaginationMetadata = Omit<PaginatedResponse<ListTicketResponse>, "items">;


/**
 * Props do componente responsável por listar os chamados do cliente.
 */
type CalledContainerProps = {
    tickets: ListTicketResponse[];
    detailsRoute: string;
    pagination: PaginationMetadata;
    onPageChange: (page: number) => void;
};


// Definimos os tipos de abas para evitar erros de digitação
type TabType = "em andamento" | "finalizados";


/**
 * Componente responsável por renderizar a lista de chamados do usuário.
 *
 * Responsabilidades:
 * - Exibir os chamados em formato de lista (cards)
 * - Permitir navegação para a tela de detalhes ao clicar em um chamado
 * - Apresentar informações resumidas (serviço, data, despachante, status)
 */
export default function CalledContainer({ tickets, detailsRoute, pagination, onPageChange }: CalledContainerProps) {
    const [activeTab, setActiveTab] = useState<TabType>("em andamento");

    const filteredTickets = tickets.filter((ticket) => {
        const isFinished =
            ticket.status.toLowerCase().includes("concluído") ||
            ticket.status.toLowerCase().includes("finalizado") ||
            ticket.status.toLowerCase().includes("encerrado");

        return activeTab === "finalizados" ? isFinished : !isFinished;
    });
    console.log("pagination CalledContainer", pagination);

    const handlePageChange = (newPage: number) => {
        if (pagination?.pages && newPage >= 1 && newPage <= pagination.pages) {
            onPageChange?.(newPage);
        }
    };

    return (
        <div className="bg-white p-4 md:p-8 rounded-[40px] border border-zinc-100 shadow-sm min-h-[400px] relative border-t-[6px] border-t-[#21314D]">

            {/* --- CABEÇALHO DAS ABAS --- */}
            <div className="flex gap-2 mb-8 bg-zinc-100/50 p-1.5 rounded-[20px] w-full md:w-fit">
                {(["em andamento", "finalizados"] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 md:flex-none cursor-pointer px-4 md:px-6 py-2.5 rounded-[16px] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300",
                            activeTab === tab
                                ? "bg-[#21314D] text-white shadow-md scale-105"
                                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50"
                        )}
                    >
                        {tab === "em andamento" ? "Em Andamento" : "Finalizados"}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredTickets.map((ticket) => {
                    const relatedName = ticket.name_dispatcher ?? ticket.name_client;
                    const relatedLabel = ticket.name_dispatcher ? "Despachante" : "Cliente";
                    const theme = getStatusTheme(ticket.status);

                    return (
                        <Link
                            key={ticket.id}
                            to={detailsRoute.replace(":ticketId", ticket.id.toString())}
                            className={cn(
                                "group flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-[28px] border border-zinc-100 bg-zinc-50/40 transition-all duration-300",
                                "hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1",
                                theme.cardHover
                            )}
                        >
                            {/* ESQUERDA: IDENTIFICAÇÃO E SERVIÇO */}
                            <div className="flex flex-row items-center gap-4 md:gap-5">
                                {/* ID Box: Tamanho fixo maior no desktop, reduz levemente no mobile */}
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex flex-col items-center justify-center text-[#21314D] shadow-sm border border-zinc-100 shrink-0">
                                    <span className="text-[8px] md:text-[10px] font-black opacity-40 uppercase leading-none mb-0.5">ID</span>
                                    <span className="font-black text-xs md:text-sm">#{ticket.id}</span>
                                </div>

                                <div>
                                    <h4 className="text-xs md:text-sm font-black text-[#1E1E1E] uppercase tracking-tight mb-1">
                                        {ticket.name_service}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-zinc-100 text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-wider">
                                            <Clock size={12} className="text-[#21314D]" />
                                            {formatDate(ticket.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* DIREITA: INFO E STATUS */}
                            <div className="flex items-center justify-between lg:justify-end gap-6 md:gap-10 mt-5 lg:mt-0 pt-5 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                                <div className="text-left lg:text-right">
                                    <p className="text-[8px] md:text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-1">
                                        {relatedLabel}
                                    </p>
                                    <p className="text-xs md:text-sm font-extrabold text-[#21314D] group-hover:text-black transition-colors">
                                        {relatedName}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all",
                                            theme.badge
                                        )}
                                    >
                                        <span className="shrink-0">{theme.icon}</span>
                                        {ticket.status}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {/* ESTADO VAZIO */}
                {!filteredTickets.length && (
                    <div className="flex flex-col items-center justify-center py-24 bg-zinc-50/50 rounded-[40px] border-2 border-dashed border-zinc-200">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4 border border-zinc-100">
                            <Clock size={32} className="text-zinc-200" />
                        </div>
                        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
                            Nenhum chamado {activeTab}
                        </p>
                    </div>
                )}
            </div>


            {/* ========================================================
                BARRA DE PAGINAÇÃO
               ======================================================== */}
            {pagination?.pages && pagination.pages > 1 ? (
                <div className="mt-8 pt-6 border-t border-zinc-100 w-full">
                    <Pagination>
                        <PaginationContent>

                            {/* Botão Voltar */}
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(pagination.page - 1);
                                    }}
                                    className={cn(
                                        "cursor-pointer",
                                        pagination.page === 1 && "pointer-events-none opacity-40"
                                    )}
                                />
                            </PaginationItem>

                            {/* Renderização das Páginas Numéricas */}
                            {Array.from({ length: pagination.pages }, (_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href="#"
                                            isActive={pagination.page === pageNumber}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(pageNumber);
                                            }}
                                            className="cursor-pointer font-bold rounded-xl"
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            {/* Botão Avançar */}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(pagination.page + 1);
                                    }}
                                    className={cn(
                                        "cursor-pointer",
                                        pagination.page === pagination.pages && "pointer-events-none opacity-40"
                                    )}
                                />
                            </PaginationItem>

                        </PaginationContent>
                    </Pagination>
                    <div className="text-center text-xs md:text-sm text-zinc-400 mt-3 font-medium">
                        Mostrando {filteredTickets.length} de {pagination.total} chamados totais.
                    </div>
                </div>
            ) : null}
        </div>
    );
}

/**
 * Mapeamento de Temas por Status
 * Centraliza a identidade visual para ser usada no card
 */
const getStatusTheme = (status: string) => {
    const s = status.toLowerCase();

    if (s.includes("pendente") || s.includes("recusado")) {
        return {
            icon: <AlertCircle size={14} />,
            badge: "bg-amber-50 text-amber-600 border-amber-200/50",
            dot: "bg-amber-500",
            cardHover: "hover:border-amber-200"
        };
    }
    if (s.includes("andamento")) {
        return {
            icon: <PlayCircle size={14} />,
            badge: "bg-blue-50 text-blue-600 border-blue-200/50",
            dot: "bg-blue-500",
            cardHover: "hover:border-blue-200"
        };
    }
    if (s.includes("concluído") || s.includes("finalizado")) {
        return {
            icon: <CheckCircle2 size={14} />,
            badge: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
            dot: "bg-emerald-500",
            cardHover: "hover:border-emerald-200"
        };
    }
    if (s.includes("encerrado")) {
        return {
            icon: <XCircle size={14} />,
            badge: "bg-zinc-100 text-zinc-500 border-zinc-200",
            dot: "bg-zinc-400",
            cardHover: "hover:border-zinc-300"
        };
    }

    return {
        icon: <Clock size={14} />,
        badge: "bg-zinc-50 text-zinc-400 border-zinc-100",
        dot: "bg-zinc-300",
        cardHover: "hover:border-zinc-200"
    };
};
