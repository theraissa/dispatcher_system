import { useTicketTimeline } from "@/hooks/use-ticket-timeline";
import { formatDate } from "@/utils/formatters";
import { CheckCircle2, Clock, PlayCircle, AlertCircle, Info, XCircle } from "lucide-react";
import { useState } from "react";


/**
 * Componente responsável por exibir a timeline de um ticket.
 *
 * - Mostra os status em formato de "esteira" (horizontal)
 * - Permite selecionar um status ao clicar no ícone
 * - Exibe a descrição do status selecionado
 */
export function TimelineTicket({ ticketId }: { ticketId: number }) {

    // Hook que busca os eventos da timeline do ticket
    const { data, loading } = useTicketTimeline(ticketId);

    // Armazena o item atualmente selecionado pelo usuário
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Estado de carregamento (skeleton)
    if (loading) {
        return (
            <div className="h-40 bg-white/50 animate-pulse rounded-[32px] border border-zinc-100" />
        );
    }

    return (
        <section className="bg-white p-2 rounded-[40px] shadow-sm border border-zinc-100 mb-8 overflow-hidden">
            <div className="bg-zinc-50/50 p-6 rounded-[36px]">

                {/* =========================
                   TRACKER (LINHA DO TEMPO)
                   ========================= */}
                <div className="relative mb-4 px-4">

                    {/* Linha de fundo (trilha visual da timeline) */}
                    <div className="absolute top-7 left-10 right-10 h-1.5 bg-zinc-200/60 rounded-full" />

                    <div className="relative flex justify-between items-start">

                        {/* Renderiza cada etapa da timeline */}
                        {data.map((item) => {

                            const { icon, styles, labelColor } = iconStatus(item.status);

                            return (
                                <div key={item.id} className="flex flex-col items-center relative z-10">

                                    {/* Ícone do status (clicável) */}
                                    <div
                                        onClick={() => setSelectedItem(item)} // Seleciona o item ao clicar
                                        className={`cursor-pointer w-14 h-14 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 shadow-sm ${styles}`}>
                                        {icon}
                                    </div>

                                    {/* Informações do status */}
                                    <div className="mt-4 text-center max-w-[200px]">
                                        <p className={`text-[14px] font-black uppercase mb-2 ${labelColor}`}>
                                            {item.status}
                                        </p>
                                        <p className="text-[12px] font-bold text-zinc-400">
                                            {formatDate(item.created_at)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* =========================
                   CARD DE DESCRIÇÃO
                   ========================= */}
                {selectedItem && (
                    <div className="bg-white p-5 rounded-[28px] border border-zinc-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#21314D]" />

                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-[#21314D] shrink-0 border border-zinc-100">
                                <Info size={30} strokeWidth={2.5} />
                            </div>

                            <div className="flex-1">
                                <span className="text-[12px] font-black text-zinc-400 uppercase">
                                    Descrição da última atualização
                                </span>

                                <p className="text-[16px] font-bold text-[#1E1E1E] leading-relaxed tracking-tight">
                                    {selectedItem.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
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
