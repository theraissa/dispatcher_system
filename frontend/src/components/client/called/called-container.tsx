import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type CalledContainerProps = {
    tickets: Array<{
        id: string;
        service: string;
        dispatcher: string;
        date: string;
        state: string;
        status: string;
    }>;
};


export default function CalledContainer({ tickets }: CalledContainerProps) {

    return (
        < div className="bg-white p-4 md:p-8 rounded-[40px] border border-zinc-100 shadow-sm min-h-[400px]" >
            <div className="space-y-4">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="group flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-[24px] border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-[#21314D]/20 hover:shadow-md transition-all cursor-pointer"
                    >
                        {/* Lado Esquerdo: Info Principal */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#21314D] shadow-sm font-bold text-xs border border-zinc-100">
                                #{ticket.id}
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-[#1E1E1E] uppercase tracking-tight">
                                    {ticket.service}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {ticket.date}</span>
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {ticket.state}</span>
                                </div>
                            </div>
                        </div>

                        {/* Lado Direito: Despachante e Status */}
                        <div className="flex items-center justify-between lg:justify-end gap-8 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Despachante</p>
                                <p className="text-sm font-bold text-[#21314D]">{ticket.dispatcher}</p>
                            </div>

                            <div className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm",
                                ticket.status === "Concluído" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            )}>
                                {ticket.status}
                            </div>
                        </div>
                    </div>
                ))}

                {tickets.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-zinc-400 text-sm italic">Nenhum chamado encontrado.</p>
                    </div>
                )}
            </div>
        </div >
    );
}
