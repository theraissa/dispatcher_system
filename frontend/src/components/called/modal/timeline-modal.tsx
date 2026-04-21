import { useState } from "react";

/**
 * Props esperadas pelo modal de atualização de status.
 */
interface UpdateStatusModalProps {
    // controla a visibilidade do modal
    isOpen: boolean;
    // função chamada ao fechar o modal
    onClose: () => void;
    // função assíncrona responsável por salvar os dados
    onSave: (status: string, description: string) => Promise<void>;
}

/**
 * Lista de opções disponíveis para o status.
 */
const STATUS_OPTIONS = [
    "pendente",
    "em Andamento",
    "finalizado",
    "encerrado"
];


/**
 * Modal responsável por atualizar o status de uma entidade/ticket.
 */
export function TimelineModal({ isOpen, onClose, onSave }: UpdateStatusModalProps) {

    // Estado do status selecionado
    const [newStatus, setNewStatus] = useState("");

    // Estado da descrição digitada pelo usuário
    const [description, setDescription] = useState("");

    // Controla estado de loading durante o salvamento
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Evita renderizar o modal quando não estiver aberto.
     * Isso remove o componente do DOM completamente.
     */
    if (!isOpen) return null;

    /**
     * Função responsável por salvar os dados do formulário.
     */
    async function handleSave() {
        // Validação simples: impede envio sem status
        if (!newStatus) return;

        setIsSubmitting(true);

        try {
            // Chama função externa (ex: API)
            await onSave(newStatus, description);

            // Limpa os campos após sucesso
            setNewStatus("");
            setDescription("");

            // Fecha o modal
            onClose();
        } catch (error) {
            // Log simples — ideal substituir por feedback visual no futuro
            console.error("Erro ao salvar status:", error);
        } finally {
            // Garante que o loading sempre será resetado
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 shadow-xl">

                {/* Título */}
                <h2 className="flex justify-center text-lg font-bold text-[#21314D]">
                    Atualizar Status
                </h2>

                {/* Campo de seleção de status */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                        Status
                    </label>

                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full border border-zinc-200 p-2.5 rounded-lg focus:ring-2 focus:ring-[#21314D] outline-none transition-all"
                    >
                        <option value="">Selecione um status</option>

                        {/* Renderiza opções dinamicamente */}
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campo de descrição */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                        Descrição
                    </label>

                    <textarea
                        placeholder="Descreva a atualização..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-zinc-200 p-2.5 rounded-lg h-24 resize-none focus:ring-2 focus:ring-[#21314D] outline-none transition-all"
                    />
                </div>

                {/* Ações do modal */}
                <div className="flex justify-end gap-3 pt-2">

                    {/* Botão de cancelar */}
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>

                    {/* Botão de salvar */}
                    <button
                        onClick={handleSave}
                        disabled={!newStatus || isSubmitting}
                        className="bg-[#21314D] text-white px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {/* Feedback visual durante o envio */}
                        {isSubmitting ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
