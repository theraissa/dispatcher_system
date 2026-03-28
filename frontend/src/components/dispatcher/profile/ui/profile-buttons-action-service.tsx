import { Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  className?: string;
};

export default function ServiceActionButtons({ onEdit, onDelete, className }: Props) {
  // Estilo base para os botões de ação
  const buttonBase = "p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center active:scale-90";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Botão Editar */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita abrir os detalhes ao clicar no botão
          onEdit(e);
        }}
        title="Editar serviço"
        className={cn(
          buttonBase,
          "bg-zinc-100 text-zinc-600 hover:bg-[#21314D] hover:text-white"
        )}
      >
        <Edit3 size={16} strokeWidth={2.5} />
      </button>

      {/* Botão Excluir */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita abrir os detalhes ao clicar no botão
          onDelete(e);
        }}
        title="Excluir serviço"
        className={cn(
          buttonBase,
          "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
        )}
      >
        <Trash2 size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
