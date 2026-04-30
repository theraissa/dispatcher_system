import { cn } from "@/lib/utils";
import { CheckCircle, Mail, User, XCircle } from "lucide-react";

interface Dispatcher {
  id: number;
  name: string;
  email: string;
}

type AdminDispatcherCardProps = {
  dispatcher: Dispatcher;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};


export default function AdminDispatcherCard({ dispatcher, onApprove, onReject }: AdminDispatcherCardProps) {
  return (
    <div className="w-full bg-white p-5 rounded-[32px] border border-zinc-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md">

      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Avatar / Inicial */}
        <div className="w-12 h-12 rounded-2xl bg-[#21314D]/5 flex items-center justify-center text-[#21314D]">
          <User size={24} />
        </div>

        {/* Informações do Despachante */}
        <div className="flex flex-col">
          <span className="text-base font-extrabold text-[#1E1E1E] tracking-tight">
            {dispatcher.name}
          </span>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Mail size={14} />
            <span className="text-xs font-medium">{dispatcher.email}</span>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
        <button
          onClick={() => onReject(dispatcher.id)}
          className={cn(
            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
            "bg-red-50 text-red-600 hover:bg-red-100 active:scale-95"
          )}
        >
          <XCircle size={18} />
          Reprovar
        </button>

        <button
          onClick={() => onApprove(dispatcher.id)}
          className={cn(
            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
            "bg-[#21314D] text-white hover:bg-[#1A263D] shadow-sm active:scale-95"
          )}
        >
          <CheckCircle size={18} />
          Aprovar
        </button>
      </div>
    </div>
  )
}
