import AdminDispatcherCard from "./dispatcher-card";
import { Coffee, ShieldCheck, Loader2 } from "lucide-react";

interface Dispatcher {
    id: number;
    name: string;
    email: string;
}

interface Props {
    dispatchers: Dispatcher[];
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    loading?: boolean; // Adicionei suporte a loading
}

export default function AdminDispatcherList({ dispatchers, onApprove, onReject, loading }: Props) {

    // Estado de Carregamento (opcional, mas bom para UX)
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
                <Loader2 className="animate-spin text-[#21314D]" size={32} />
                <p className="text-sm font-medium italic">Sincronizando base de dados...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Cabeçalho da Lista (Opcional, ajuda na organização) */}
            {dispatchers.length > 0 && (
                <div className="flex items-center justify-between px-6 mb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                        Despachantes Pendentes ({dispatchers.length})
                    </span>
                    <div className="h-px flex-1 bg-zinc-100 ml-4" />
                </div>
            )}

            {/* Mapeamento dos Cards */}
            {dispatchers.map(d => (
                <AdminDispatcherCard
                    key={d.id}
                    dispatcher={d}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            ))}

            {/* Empty State Refinado */}
            {dispatchers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-[40px] border-2 border-dashed border-zinc-200 transition-all">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-sm">
                        <ShieldCheck size={32} />
                    </div>
                    <h4 className="text-lg font-extrabold text-[#1E1E1E] tracking-tight">Tudo em ordem!</h4>
                    <p className="text-zinc-500 text-sm max-w-[250px] text-center mt-1 leading-relaxed">
                        Não há novos despachantes aguardando aprovação no momento.
                    </p>

                    <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-zinc-100 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <Coffee size={12} />
                        Hora do café
                    </div>
                </div>
            )}
        </div>
    );
}
