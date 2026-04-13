import { Clock, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

/*
*
*/
export function TimelineTicket() {
    return (
        <section className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100">
            <h3 className="text-sm font-bold text-[#1E1E1E] uppercase tracking-wider mb-8 text-center">Status do Chamado</h3>
            <div className="relative space-y-8">
                <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-zinc-50" />
                <TimelineStep
                    icon={<CheckCircle2 size={16} />}
                    title="Aberto"
                    date="08/04 - 14:00"
                    isDone
                />
                <TimelineStep
                    icon={<Clock size={16} />}
                    title="Em Execução"
                    date="Hoje - 10:15"
                    isActive
                />
            </div>
        </section>
    )
}


/*
*
*/
type TimelineStepProps = {
    /**/
    icon: ReactNode;
    /**/
    title: string;
    /**/
    date: string;
    /**/
    isDone?: boolean;
    /**/
    isActive?: boolean;
}

/*
*
*/
function TimelineStep({ icon, title, date, isDone, isActive }: TimelineStepProps) {
    return (
        <div className="relative flex gap-4">
            <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center border transition-all
                ${isDone ? 'bg-green-50 border-green-100 text-green-600' :
                    isActive ? 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse' :
                        'bg-zinc-50 border-zinc-100 text-zinc-400'}`}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-xs text-[#1E1E1E]">{title}</h4>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{date}</p>
            </div>
        </div>
    );
}
