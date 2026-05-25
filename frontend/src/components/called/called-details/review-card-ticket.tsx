import { formatDate } from "@/utils/formatters";
import { MessageSquare, PencilLine, Star } from "lucide-react"; // Importado o ícone PencilLine

// Adicionada a propriedade opcional onEdit nas Props
type TicketReviewCardProps = {
    review: {
        rating: number;
        comment?: string;
        created_at: string;
    };
    clientName: string;
    onEdit?: () => void; // <-- Callback para abrir o modal de edição
};

export function TicketReviewCard({ review, clientName, onEdit }: TicketReviewCardProps) {
    return (
        <div className="bg-white p-5 rounded-[24px] border border-zinc-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 border-t-[4px] border-t-amber-400">

            {/* Header da Seção com o Botão de Atualizar */}
            <div className="flex items-center justify-between mb-3 gap-2">
                <h4 className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-[0.15em]">
                    Sua Avaliação deste Atendimento
                </h4>

                {/* Só renderiza o botão se a função onEdit for passada (ex: apenas na tela do cliente) */}
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="cursor-pointer flex items-center gap-1 text-[10px] md:text-xs font-bold text-[#21314D] hover:text-[#1A263D] bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 px-2 py-1 rounded-lg transition-all active:scale-95"
                    >
                        <PencilLine size={12} />
                        Editar
                    </button>
                )}
            </div>

            {/* Estrelas */}
            <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? "#FFB800" : "none"}
                        className={i < review.rating ? "text-[#FFB800]" : "text-zinc-200"}
                    />
                ))}
            </div>

            {/* Comentário (Se existir) */}
            {review.comment ? (
                <p className="text-sm text-zinc-600 font-medium leading-relaxed italic bg-zinc-50 p-3.5 rounded-xl border border-zinc-100 mb-4">
                    "{review.comment}"
                </p>
            ) : (
                <p className="text-xs text-zinc-400 font-medium italic mb-4 flex items-center gap-1.5">
                    <MessageSquare size={12} />
                    Nenhum comentário preenchido.
                </p>
            )}

            {/* Autor e Data */}
            <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
                <div className="w-7 h-7 bg-[#21314D] text-white rounded-full flex items-center justify-center font-black text-[10px]">
                    {clientName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-extrabold text-[#1E1E1E] uppercase truncate">
                        {clientName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold">
                        {formatDate(review.created_at)}
                    </span>
                </div>
            </div>
        </div>
    );
}
