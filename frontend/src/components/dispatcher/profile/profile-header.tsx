import { InstagramIcon } from "@/components/icons/lucide-instagram";
import { Globe, MessageCircle, Edit3, Save, Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile, UserType } from "@/types/type";


/**
 * Props do componente ProfileHeader.
 */
type Props = {
  // Dados básicos do usuário.
  user: UserType;
  // Dados adicionais do perfil do despachante.
  profile: Profile;
  // Indica se o perfil está em modo de edição.
  isEditing: boolean;
  // Função para alternar o modo de edição.
  setIsEditing: (value: boolean) => void;
};


/**
 * Componente de cabeçalho do perfil do despachante.
 *
 * Exibe:
 * - Foto do usuário
 * - Nome e contato
 * - Links de redes sociais
 * - Botão de edição/salvar perfil
 * - Overlay para alteração de foto (modo edição)
 */
export default function ProfileHeader({
  user,
  profile,
  isEditing,
  setIsEditing,
}: Props) {

  return (
    <div className="w-full h-52 flex justify-center mb-8">
      <div
        className={cn(
          "relative w-full bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-zinc-100",
          "flex flex-col md:flex-row items-center gap-6"
        )}
      >

        {/* =========================
            CONTAINER DE AÇÕES (TOPO DIREITO)
           ========================= */}
        <div className="absolute top-8 right-8 flex items-center gap-2">

          {/* Botão Cancelar (Apenas em edição) */}
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all active:scale-95 border border-red-100"
            >
              <X size={18} />
              Cancelar
            </button>
          )}

          {/* Botão Editar / Salvar */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "cursor-pointer flex items-center gap-4 px-6 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm",
              isEditing
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-[#21314D] text-white hover:bg-[#1A263D]"
            )}
          >
            {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
            {isEditing ? "Salvar Alterações" : "Editar Perfil"}
          </button>
        </div>

        {/* =========================
            FOTO DO USUÁRIO
           ========================= */}
        <div className="relative group">
          <div
            className="w-32 h-32 md:w-38 md:h-38 rounded-full bg-zinc-100 border-4 border-white shadow-md overflow-hidden bg-cover bg-center transition-all"
            style={{
              backgroundImage: `url(${profile.photo || "https://via.placeholder.com/150"})`,
            }}
          />

          {isEditing && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
          )}
        </div>

        {/* =========================
            INFORMAÇÕES DO USUÁRIO
           ========================= */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <h2 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
            {user.name || "Nome do Despachante"}
          </h2>

          {/* REDES SOCIAIS */}
          <div className="flex gap-6 pt-6">
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-[#E4405F] transition-colors"
              >
                <InstagramIcon size={30} />
              </a>
            )}

            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle size={30} />
              </a>
            )}

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-[#21314D] transition-colors"
              >
                <Globe size={30} />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
