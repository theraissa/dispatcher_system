import { cn } from "@/lib/utils";
import { ArrowRight, Settings } from "lucide-react";

type Props = {
  title: string;
  description: string;
  icon?: React.ReactNode; // Adicionei suporte a ícone
  onClick?: () => void;
  className?: string;
};

export default function AdminDashboardCard({ title, description, icon, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1 hover:border-[#21314D]/20",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Container do Ícone */}
        <div className="p-3 bg-zinc-50 rounded-2xl text-[#21314D] group-hover:bg-[#21314D] group-hover:text-white transition-colors duration-300">
          {icon || <Settings size={24} />}
        </div>

        {/* Seta de Indicação (Aparece no Hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
          <ArrowRight size={20} className="text-[#21314D]" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-extrabold text-[#1E1E1E] tracking-tight group-hover:text-[#21314D] transition-colors">
          {title}
        </h3>
        <p className="text-sm font-medium text-zinc-500 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Detalhe visual sutil no fundo */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#21314D]/[0.02] rounded-tl-[100px] -z-10 group-hover:bg-[#21314D]/[0.05] transition-colors" />
    </button>
  );
}
