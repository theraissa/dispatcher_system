import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Interface para as propriedades do botão de envio.
 */
interface ButtonSubmitFormProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;   // Texto exibido no botão
  loading?: boolean; // Estado de carregamento (ativa spinner e desativa clique)
}

/**
 * Componente de botão de submissão padronizado.
 */
export default function ButtonSubmitForm({
  title,
  loading,
  className,
  ...props
}: ButtonSubmitFormProps) {
  return (
    <button
      type="submit"
      // Desativa o botão enquanto estiver carregando para evitar cliques duplos
      disabled={loading}
      className={cn(
        /* Layout e Cursor */
        "w-full max-w-[500px] h-12 mt-6 px-4 py-2 flex items-center justify-center mx-auto",
        "cursor-pointer", // ADICIONADO: Garante o ícone de 'mãozinha' ao passar o mouse

        /* Cores e Estilo */
        "bg-[#2D2D2D] text-white text-lg font-semibold rounded-xl transition-all",

        /* Estados de Interação (Hover e Active) */
        "hover:bg-[#1A1A1A] active:scale-[0.98]",

        /* Estado Desativado (Loading) */
        "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",

        /* Tipografia e Sombra */
        "shadow-sm font-sans",
        className
      )}
      {...props}
    >
      {loading ? (
        /* Conteúdo exibido durante o carregamento */
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando...</span>
        </div>
      ) : (
        /* Texto normal do botão */
        title
      )}
    </button>
  );
}
