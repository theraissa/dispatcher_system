import { useDispatcherStatistics } from "@/hooks/use-dispatcher-statistics";
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";

/**
 * Componente responsável por exibir as estatísticas do despachante no dashboard.
 *
 * Responsabilidades:
 * - Consumir o hook `useDispatcherStatistics`
 * - Exibir métricas de desempenho (chamados e faturamento)
 * - Renderizar estados de loading e fallback
 *
 * Métricas exibidas:
 * - Pendentes → chamados aguardando atendimento
 * - Em andamento → chamados em progresso
 * - Finalizados (Mês) → chamados concluídos no mês atual
 * - Lucro Mensal → soma dos valores dos serviços finalizados no mês
 *
 * @param userId ID do usuário despachante
 *
 * @returns Seção visual com cards de estatísticas
 */
export function HomeStaticsDispatcher({ userId }: { userId: number }) {

    // Hook responsável por buscar as estatísticas do backend
    const { statistics, loading } = useDispatcherStatistics(userId);

    /**
     * Estrutura base para renderização dos cards.
     * Utiliza fallback (?? 0) para evitar valores undefined na UI.
     */
    const stats = [
        {
            label: "Pendentes",
            value: statistics?.pending ?? 0,
            icon: <AlertCircle size={22} />,
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            label: "Em andamento",
            value: statistics?.in_progress ?? 0,
            icon: <Clock size={22} />,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            label: "Finalizados (Mês)",
            value: statistics?.finished_month ?? 0,
            icon: <CheckCircle2 size={22} />,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            label: "Lucro Mensal",
            value: `R$ ${statistics?.monthly_revenue ?? 0}`,
            icon: <TrendingUp size={22} />,
            color: "text-[#21314D]",
            bg: "bg-zinc-100"
        }
    ];

    /**
     * Estado de carregamento:
     * Exibe um feedback simples enquanto os dados são buscados.
     */
    if (loading) {
        return (
            <div className="py-20 text-center text-zinc-400">
                Carregando estatísticas...
            </div>
        );
    }

    return (
        <section className="relative bg-[#D9CDBA]/30 -mx-4 md:-mx-6 px-4 md:px-6 py-12 md:py-20 overflow-hidden">
            {/* Linha decorativa superior */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

            <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-xl md:text-3xl font-black text-[#1E1E1E] uppercase tracking-tighter">
                        Faturamento e <span className="text-[#21314D]">Progresso</span>
                    </h2>
                    <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
                        Dados atualizados em tempo real
                    </p>
                </div>

                {/* Grid de estatísticas */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="group bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-zinc-200/60 flex flex-col items-center text-center transition-all"
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-5`}>
                                {stat.icon}
                            </div>
                            <p className="text-2xl md:text-3xl font-black text-[#1E1E1E] tracking-tight mb-1">
                                {stat.value}
                            </p>
                            <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-tight">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Linha decorativa inferior */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
        </section >
    );
}
