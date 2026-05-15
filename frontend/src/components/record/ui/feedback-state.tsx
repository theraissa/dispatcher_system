import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, UserX, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Props para o componente de Feedback/NotFound genérico.
 */
type FeedbackStateProps = {
    title?: string;
    description?: string;
    icon?: LucideIcon; // Permite passar qualquer ícone do Lucide
    buttonText?: string;
    onAction?: () => void; // Ação customizada (ex: abrir um modal ou voltar)
    className?: string;
};

export function FeedbackState({
    title = "Não encontrado",
    description = "O conteúdo que você procura não está disponível no momento.",
    icon: Icon = UserX, // Ícone padrão caso nenhum seja passado
    buttonText = "Voltar",
    onAction,
    className
}: FeedbackStateProps) {
    const navigate = useNavigate();

    // Se não for passada uma ação, o padrão é voltar uma página
    const handleAction = onAction || (() => navigate(-1));

    return (
        <div className={cn(
            "min-h-screen bg-[#F3EDE2] flex flex-col items-center justify-center px-4 transition-all duration-300",
            className
        )}>
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-zinc-100 flex flex-col items-center max-w-sm text-center">

                {/* Container do Ícone */}
                <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 mb-6 border border-zinc-100">
                    <Icon size={40} strokeWidth={1.5} />
                </div>

                {/* Textos */}
                <h2 className="text-xl font-bold text-[#1E1E1E] mb-2 tracking-tight">
                    {title}
                </h2>

                <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-medium">
                    {description}
                </p>

                {/* Botão de Ação */}
                <Button
                    onClick={handleAction}
                    className="cursor-pointer w-full h-12 bg-[#21314D] hover:bg-[#1A263D] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                    <ArrowLeft size={18} />
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
