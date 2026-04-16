import { Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";


/**
 * Props do componente ServiceActionButtons.
 */
type Props = {
  // Callback executado ao clicar no botão de edição.
  onEdit: (e: React.MouseEvent) => void;
  // Callback executado ao clicar no botão de exclusão.
  onDelete: (e: React.MouseEvent) => void;
  // Classe adicional para customização externa do container.
  className?: string;
};


/**
 * Componente de ações rápidas para um serviço.
 *
 * Fornece botões de editar e excluir com comportamento isolado
 * para evitar propagação de clique para o item pai.
 */
export default function ServiceActionButtons({
  onEdit,
  onDelete,
  className,
}: Props) {

  // Classe base compartilhada entre os botões de ação.
  const buttonBase =
    "p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center active:scale-90";

  return (
    <div className={cn("flex items-center gap-2", className)}>

      {/* =========================
          BOTÃO EDITAR
         ========================= */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // impede abrir detalhes do item pai
          onEdit(e);
        }}
        title="Editar serviço"
        className={cn(
          buttonBase,
          "bg-zinc-100 text-zinc-600 hover:bg-[#21314D] hover:text-white"
        )}
      >
        <Edit3 size={20} strokeWidth={2.5} />
      </button>

      {/* =========================
          BOTÃO EXCLUIR
         ========================= */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // impede abertura do item pai
          onDelete(e);
        }}
        title="Excluir serviço"
        className={cn(
          buttonBase,
          "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
        )}
      >
        <Trash2 size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
