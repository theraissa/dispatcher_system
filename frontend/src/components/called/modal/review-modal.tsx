import {
    Dialog, DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MessageSquare, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


/**
 * Props do componente ReviewModal.
 */
type ReviewModalProps = {
    /** Controla se o modal está aberto */
    isOpen: boolean;
    /** Pega estrelas selecionados antes do modal*/
    initialRating?: number;
    /** Pega o comentário realizado no review*/
    initialComment?: string;
    /** Callback disparado ao fechar o modal */
    onClose: (open: boolean) => void;
    /** Callback responsável por enviar a avaliação */
    onSubmit: (data: { rating: number; comment?: string }) => void;
    /** Estado de carregamento durante envio */
    loading: boolean;
};


/**
 * Componente de modal para avaliação de atendimento (ReviewModal).
 *
 * Responsabilidades:
 * - Coletar avaliação do usuário (nota de 1 a 5)
 * - Coletar comentário opcional
 * - Validar entrada antes do envio
 * - Disparar callback externo com os dados da avaliação
 * 
 * Regras de validação:
 * - O usuário deve selecionar pelo menos 1 estrela
 *
 * Estados internos:
 * - rating → nota selecionada (1 a 5)
 * - comment → texto opcional da avaliação
 *
 * Integração:
 * - O envio é delegado via `onSubmit`, permitindo desacoplamento da lógica de API
 * - O estado `loading` controla feedback visual no botão
 */
export function ReviewModal({ isOpen, onClose, onSubmit, loading, initialRating = 0, initialComment }: ReviewModalProps) {

    // Comentário e nota do usuário em relação ao chamado   
    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState(initialComment || "");

    // Armazenamos o valor da prop anterior para comparar
    const [prevInitialRating, setPrevInitialRating] = useState(initialRating);
    const [prevComment, setPrevComment] = useState(initialComment);

    // Se a prop mudou, ajustamos o estado imediatamente durante a renderização
    if (initialRating !== prevInitialRating) {
        setRating(initialRating);
        setPrevInitialRating(initialRating);
    }

    // Se o pai mandou algo diferente do que estava guardado, 
    // atualizamos o estado local IMEDIATAMENTE durante a renderização
    if (initialComment !== prevComment || initialRating !== prevInitialRating) {
        setComment(initialComment || "");
        setRating(initialRating || 0);
        setPrevComment(initialComment);
        setPrevInitialRating(initialRating);
    }
    /**
     * Manipula o envio da avaliação.
     *
     * Fluxo:
     * - Valida se o usuário selecionou uma nota
     * - Exibe feedback de erro caso inválido
     * - Dispara o callback `onSubmit` com os dados
     */
    const handleSend = () => {
        if (loading) return;
        if (rating === 0) return toast.error("Por favor, selecione uma nota.");
        onSubmit({ rating, comment });
    };

    /**
     * Manipula a abertura e fechamento do modal de avaliação.
     *
     * Fluxo:
     * - Quando `open` for false (modal fechado):
     *   - Reseta a nota selecionada (`rating`)
     *   - Limpa o comentário (`comment`)
     * - Propaga o estado para o componente pai via `onClose`
     */
    function handleOpenChange(open: boolean) {
        if (!open) {
            setRating(0);
            setComment("");
        }
        onClose(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-[32px]">

                {/* =========================
                   HEADER DO MODAL
                   ========================= */}
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Avaliar Atendimento
                    </DialogTitle>

                    <DialogDescription className="font-medium text-zinc-500">
                        Sua opinião é muito importante para melhorarmos nossos serviços.
                    </DialogDescription>
                </DialogHeader>

                {/* =========================
                   CONTEÚDO (FORMULÁRIO)
                   ========================= */}
                <div className="py-6 flex flex-col items-center gap-6">

                    {/* Seleção de estrelas (rating) */}
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button" // Sempre use type button em modais para evitar submit de forms
                                onClick={() => {
                                    setRating(star);
                                    // Opcional: toast.success(`Nota ${star} selecionada!`, { duration: 1000 });
                                }}
                                className={cn(
                                    "cursor-pointer transition-all duration-200 transform active:scale-75",
                                    star <= rating ? "scale-110" : "scale-100 hover:scale-105"
                                )}
                            >
                                <Star
                                    size={36} // Aumentei um pouco para facilitar o toque
                                    className={cn(
                                        "transition-colors duration-300",
                                        star <= rating
                                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                                            : "text-zinc-200"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Campo de comentário */}
                    <div className="w-full space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-400 flex items-center gap-2">
                            <MessageSquare size={14} /> Comentário (Opcional)
                        </label>

                        <textarea
                            maxLength={150}
                            className="w-full min-h-[100px] p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#21314D]/10 transition-all"
                            placeholder="Conte como foi sua experiência..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>

                {/* =========================
                   FOOTER (AÇÃO)
                   ========================= */}
                <DialogFooter>
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="cursor-pointer w-full bg-[#21314D] text-white h-12 rounded-xl font-bold hover:bg-[#1A263D] disabled:opacity-50 transition-all"
                    >
                        {loading ? "Enviando..." : "Enviar Avaliação"}
                    </button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}
