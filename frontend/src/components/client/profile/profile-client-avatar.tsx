import { Camera, Edit3, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserType } from "@/types/type";


/**
 * Props do componente ProfileClientAvatar.
 */
type ProfileClientAvatarProps = {
    // Dados básicos do usuário.
    user: UserType;
    // Indica se o perfil está em modo de edição.
    isEditing: boolean;
    // Função para alternar o modo de edição.
    setIsEditing: (value: boolean) => void;
    // Função opcional para salvar as alterações
    onSave?: () => void;
};


/** * Componente de avatar do perfil do cliente.
 *
 * Exibe:
 * - Foto do usuário
 * - Nome e email
 * - Botão de edição/salvar perfil
 * - Overlay para alteração de foto (modo edição)
 */
export default function ProfileClientAvatar({ user, isEditing, setIsEditing, onSave }: ProfileClientAvatarProps) {

    return (
        <div className="w-full relative bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-zinc-100 flex flex-col md:flex-row items-center gap-6">

            {/* Container de Botões no Canto */}
            <div className="absolute top-8 right-8 flex items-center gap-2">

                {/* Botão Cancelar (Aparece apenas quando está editando) */}
                {isEditing && (
                    <button
                        onClick={() => setIsEditing(false)}
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all active:scale-95 border border-red-100"
                    >
                        <X size={18} />
                        Cancelar
                    </button>
                )}

                {/* Botão de Editar/Salvar */}
                <button
                    onClick={() => {
                        if (isEditing && onSave) {
                            onSave(); // Se houver uma função de salvar, executa
                        }
                        setIsEditing(!isEditing);
                    }}
                    className={cn(
                        "cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm",
                        isEditing
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-[#21314D] text-white hover:bg-[#1A263D]"
                    )}
                >
                    {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                    {isEditing ? "Salvar Alterações" : "Editar Perfil"}
                </button>
            </div>

            {/* Foto com Overlay */}
            <div className="relative group">
                <div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-100 border-4 border-white shadow-md overflow-hidden bg-cover bg-center transition-all"
                    style={{ backgroundImage: `url(${'https://via.placeholder.com/150'})` }}
                />
                {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                        <Camera className="text-white" size={24} />
                    </div>
                )}
            </div>

            {/* Informações do usuário */}
            <div className="text-center md:text-left pt-4 md:pt-0">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
                    {user.name}
                </h2>
                <p className="text-zinc-500 font-medium">{user.email}</p>
            </div>
        </div>
    );
}
