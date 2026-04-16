import { InstagramIcon } from "@/components/icons/lucide-instagram";
import { Globe, MessageCircle, Edit3, Save, Camera } from "lucide-react";
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
            BOTÃO EDITAR / SALVAR
           ========================= */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "cursor-pointer absolute top-8 right-8 flex items-center gap-4 px-6 py-2 rounded-lg text-[15px] font-bold transition-all",
            isEditing
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-[#21314D] text-white hover:bg-[#1A263D]"
          )}
        >
          {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
          {isEditing ? "Salvar" : "Editar Perfil"}
        </button>

        {/* =========================
            FOTO DO USUÁRIO
           ========================= */}
        <div className="relative group">

          {/* Imagem de perfil */}
          <div
            className="md:w-38 md:h-38 rounded-full bg-zinc-100 border-4 border-white shadow-md overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url(${profile.photo || "https://via.placeholder.com/150"})`,
            }}
          />

          {/* Overlay de edição (apenas no modo editável) */}
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={20} />
            </div>
          )}
        </div>

        {/* =========================
            INFORMAÇÕES DO USUÁRIO
           ========================= */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">

          {/* Nome */}
          <h2 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
            {user.name || "Nome do Despachante"}
          </h2>

          {/* =========================
              REDES SOCIAIS
             ========================= */}
          <div className="flex gap-6 pt-6">

            {/* Instagram */}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                className="text-zinc-400 hover:text-[#E4405F] transition-colors"
              >
                <InstagramIcon size={30} />
              </a>
            )}

            {/* WhatsApp */}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp}`}
                target="_blank"
                className="text-zinc-400 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle size={30} />
              </a>
            )}

            {/* Website */}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
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
