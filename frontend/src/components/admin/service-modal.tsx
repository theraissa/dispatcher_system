import { Save, X } from "lucide-react";
import { useState } from "react";

type Service = {
    id?: number;
    name: string;
    description?: string;
};

type ServiceModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; description: string }) => void;
    editingService: Service | null;
};


export default function ServiceModal({ isOpen, onClose, onSave, editingService }: ServiceModalProps) {

    const [name, setName] = useState(editingService?.name ?? "");
    const [description, setDescription] = useState(editingService?.description ?? "");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#21314D]">
                        {editingService ? "Editar Serviço" : "Novo Serviço"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Nome do Serviço</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Transferência de Veículo"
                            className="w-full h-12 px-4 mt-1 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#21314D]/10 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Descrição (Opcional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descreva brevemente o serviço..."
                            className="w-full h-32 p-4 mt-1 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#21314D]/10 outline-none resize-none"
                        />
                    </div>
                </div>

                <button
                    onClick={() => onSave({ name, description })}
                    className="w-full mt-8 bg-[#21314D] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1A263D] transition-all"
                >
                    <Save size={18} />
                    {editingService ? "Salvar Alterações" : "Criar Serviço"}
                </button>
            </div>
        </div>
    );
}
