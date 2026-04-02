import { Camera, Edit3, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileClientAvatar({ user, isEditing, setIsEditing }) {
    return (
        <div className="w-full relative bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-zinc-100 flex flex-col md:flex-row items-center gap-6">

            {/* Botão de Editar/Salvar no Canto */}
            <button
                type="button" // Importante: ser type button para não dar submit no form antes da hora
                onClick={() => isEditing ? null : setIsEditing(true)}
                // Se estiver salvando, o botão de submit do form (no header ou flutuante) fará o trabalho.
                // Aqui vamos apenas alternar o estado de edição.
                className={cn(
                    "absolute top-4 right-4 flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    isEditing
                        ? "bg-green-600 text-white"
                        : "bg-[#21314D] text-white hover:bg-[#1A263D]"
                )}
            >
                {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                {isEditing ? "Editando..." : "Editar Perfil"}
            </button>

            {/* Foto com Overlay */}
            <div className="relative group">
                <div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-100 border-4 border-white shadow-md overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.photo_url || 'https://via.placeholder.com/150'})` }}
                />
                {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer">
                        <Camera className="text-white" size={20} />
                    </div>
                )}
            </div>

            <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1E1E1E]">{user.name}</h2>
                <p className="text-zinc-500">{user.email}</p>
            </div>
        </div>
    );
}
