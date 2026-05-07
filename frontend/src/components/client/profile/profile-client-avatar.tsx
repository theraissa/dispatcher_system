import { cn } from "@/lib/utils";
import type { UserType } from "@/types/type";
import { Camera, Edit3, Save, X } from "lucide-react";


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
        <div className="w-full relative bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-zinc-100 flex flex-col md:flex-row items-center gap-6">

            {/* Container de Botões no Canto */}
            <div className="order-3 md:order-none md:absolute md:top-8 md:right-8 flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">

                {/* Botão Cancelar (Aparece apenas quando está editando) */}
                {isEditing && (
                    <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-red-50 text-red-600 border border-red-100"                    >
                        <X size={18} />
                        Cancelar
                    </button>
                )}

                {/* Botão de Editar/Salvar */}
                <button
                    onClick={() => {
                        if (isEditing && onSave) onSave();
                        setIsEditing(!isEditing);
                    }}
                    className={cn(
                        "flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm",
                        isEditing ? "bg-green-600 text-white" : "bg-[#21314D] text-white"
                    )}
                >
                    {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                    {isEditing ? "Salvar" : "Editar Perfil"}
                </button>
            </div>

            {/* Foto com Overlay */}
            <div className="relative group shrink-0">
                <div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-100 border-4 border-white shadow-md overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url(${'https://via.placeholder.com/150'})` }}
                />
                {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer">
                        <Camera className="text-white" size={24} />
                    </div>
                )}
            </div>

            {/* Informações do usuário */}
            <div className="text-center md:text-left">
                <h2 className="text-lg md:text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
                    {user.name}
                </h2>
                <p className="text-zinc-500 text-sm md:text-base font-medium">{user.email}</p>
            </div>
        </div>
    );
}
