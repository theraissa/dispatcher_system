import { InstagramIcon } from "@/components/icons/lucide-instagram";
import { Globe, MessageCircle, Edit3, Save, Camera } from "lucide-react";
import { cn } from "@/lib/utils";


export default function ProfileHeader({ user, profile, isEditing, setIsEditing }) {
  return (
    <div className="w-full flex justify-center mb-8">
      <div className={cn(
        "relative w-full bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-zinc-100",
        "flex flex-col md:flex-row items-center gap-6"
      )}>

        {/* Botão de Editar/Salvar - Pequeno e no Canto */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "absolute top-4 right-4 flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
            isEditing
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-[#21314D] text-white hover:bg-[#1A263D]"
          )}
        >
          {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
          {isEditing ? "Salvar" : "Editar Perfil"}
        </button>

        {/* Foto de Perfil com Overlay de Troca */}
        <div className="relative group">
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-100 border-4 border-white shadow-md overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${user.photo_url || 'https://via.placeholder.com/150'})` }}
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={20} />
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
            {user.name || "Nome do Despachante"}
          </h2>
          <span className="text-zinc-500 text-sm font-medium">{user.contact || "Sem contato cadastrado"}</span>

          {/* Redes Sociais com Ícones */}
          <div className="flex gap-4 pt-3">
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" className="text-zinc-400 hover:text-[#E4405F] transition-colors">
                <InstagramIcon />
              </a>
            )}
            {profile.whatsapp && (
              <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" className="text-zinc-400 hover:text-[#25D366] transition-colors">
                <MessageCircle size={20} />
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" className="text-zinc-400 hover:text-[#21314D] transition-colors">
                <Globe size={20} />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
