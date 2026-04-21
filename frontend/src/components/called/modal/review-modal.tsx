import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";


/**
 * Props do componente ReviewModal.
 */
type ReviewModalProps = {
    /** Controla se o modal está aberto */
    isOpen: boolean;
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
export function ReviewModal({ isOpen, onClose, onSubmit, loading }: ReviewModalProps) {

    // Nota selecionada pelo usuário (1 a 5).
    const [rating, setRating] = useState(0);

    // Comentário opcional da avaliação.
    const [comment, setComment] = useState("");

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

        if (rating === 0) {
            return toast.error("Por favor, selecione uma nota de 1 a 5.");
        }
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
                                onClick={() => setRating(star)}
                                className="cursor-pointer transition-transform active:scale-90"
                            >
                                <Star
                                    size={32}
                                    className={
                                        star <= rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-zinc-200"
                                    }
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
