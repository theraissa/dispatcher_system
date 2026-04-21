import { useTicketTimeline } from "@/hooks/use-ticket-timeline";
import { formatDate } from "@/utils/formatters";
import { CheckCircle2, Clock, PlayCircle, AlertCircle, Info, XCircle } from "lucide-react";
import { useState } from "react";
import { TimelineModal } from "../modal/timeline-modal";


/**
 * Componente responsável por exibir a timeline de um ticket.
 *
 * - Mostra os status em formato de "esteira" (horizontal)
 * - Permite selecionar um status ao clicar no ícone
 * - Exibe a descrição do status selecionado
 */
export function TimelineTicket({ ticketId, isDispatcher }: { ticketId: number, isDispatcher?: boolean }) {

    // Hook que busca os eventos da timeline do ticket
    const { data, loading, createTimeline } = useTicketTimeline(ticketId);

    // Armazena o item atualmente selecionado pelo usuário
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [openModal, setOpenModal] = useState(false);

    // Função que será passada para o modal
    async function handleUpdateTimeline(status: string, description: string) {
        await createTimeline({
            status, description
        });
    }

    // Estado de carregamento (skeleton)
    if (loading) {
        return (
            <div className="h-40 bg-white/50 animate-pulse rounded-[32px] border border-zinc-100" />
        );
    }

    return (
        <section className="bg-white rounded-[32px] shadow-md border border-zinc-100 mb-8 overflow-hidden border-t-[6px] border-t-[#21314D]">
            <div className="p-6 bg-zinc-50/50 m-2 rounded-[24px]">

                {isDispatcher && (
                    <div className="flex justify-end">
                        <button
                            onClick={() => setOpenModal(true)}
                            className="cursor-pointer px-6 py-2 bg-[#21314D] text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90"
                        >
                            Atualizar Status
                        </button>
                    </div>
                )}

                {/* Modal Separado */}
                <TimelineModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onSave={handleUpdateTimeline}
                />

                {/* =========================
                    TRACKER (LINHA DO TEMPO)
                    ========================= */}
                <div className="relative mb-16 mt-4 px-8 flex justify-center">
                    <div className="relative w-fit">

                        {/* Linha de fundo  */}
                        {data.length > 1 && (
                            <div
                                className="absolute top-[28px] left-[28px] right-[28px] h-[2px] bg-zinc-200 transition-all duration-500"
                                style={{ zIndex: 0 }}
                            />
                        )}

                        {/* Container dos Itens */}
                        <div className="relative flex items-center gap-50">
                            {data.map((item) => {
                                const { icon, styles, labelColor } = iconStatus(item.status);
                                const isSelected = selectedItem?.id === item.id;

                                return (
                                    <div key={item.id} className="flex flex-col items-center relative z-10">
                                        {/* Ícone com fundo branco para cobrir a linha */}
                                        <div
                                            onClick={() => setSelectedItem(item)}
                                            className={`cursor-pointer w-14 h-14 rounded-2xl flex items-center justify-center border-4 transition-all duration-300 shadow-sm hover:scale-110 bg-white ${styles} ${isSelected ? 'ring-4 ring-zinc-100' : ''}`}
                                        >
                                            <div className="bg-inherit w-full h-full rounded-xl flex items-center justify-center">
                                                {icon}
                                            </div>
                                        </div>

                                        {/* Labels absolutos */}
                                        <div className="absolute top-16 flex flex-col items-center w-32">
                                            <p className={`text-[12px] font-black uppercase whitespace-nowrap ${labelColor}`}>
                                                {item.status}
                                            </p>
                                            <p className="text-[11px] font-bold text-zinc-400 whitespace-nowrap">
                                                {formatDate(item.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* =========================
                   CARD DE DESCRIÇÃO
                   ========================= */}
                {selectedItem && (
                    <div className="bg-white p-2 rounded-[20px] border border-zinc-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#21314D]" />

                        <div className="flex items-start gap-2 pl-2">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-[#21314D] shrink-0 border border-zinc-100">
                                <Info size={20} strokeWidth={2.5} />
                            </div>

                            <div className="flex-1 pl-1">
                                <div className="flex items-center gap-2 mt-1 mb-1">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Descrição do status
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="text-[11px] font-semibold text-gray-500 uppercase">
                                        {selectedItem.status}
                                    </span>
                                </div>

                                <p className="text-[15px] font-medium text-gray-700">
                                    {selectedItem.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section >
    );
}


/**
 * Função que configura o visual do ícone baseado no status.
 *
 * Define:
 * - Cores do container
 * - Cor do texto
 */
const iconStatus = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("pendente") || s.includes("recusado")) {
        return {
            icon: <AlertCircle size={22} />,
            styles: "bg-amber-50 border-amber-200 text-amber-600",
            labelColor: "text-amber-600",
        };
    }
    if (s.includes("andamento")) {
        return {
            icon: <PlayCircle size={22} />,
            styles: "bg-blue-50 border-blue-200 text-blue-600",
            labelColor: "text-blue-600",
        };
    }
    if (s.includes("finalizado")) {
        return {
            icon: <CheckCircle2 size={22} />,
            styles: "bg-emerald-50 border-emerald-200 text-emerald-600",
            labelColor: "text-emerald-600",
        };
    }
    if (s.includes("encerrado")) {
        return {
            icon: <XCircle size={22} />,
            styles: "bg-zinc-50 border-zinc-200 text-zinc-500",
            labelColor: "text-zinc-500",
        };
    }

    // Fallback padrão
    return {
        icon: <Clock size={22} />,
        styles: "bg-zinc-50 border-zinc-100 text-zinc-400",
        labelColor: "text-zinc-400",
    };
};
