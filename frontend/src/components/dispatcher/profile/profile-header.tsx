import { InstagramIcon } from "@/components/icons/lucide-instagram";
import { cn } from "@/lib/utils";
import type { Profile, UserType } from "@/types/type";
import { Camera, Edit3, Globe, MessageCircle, Save, X } from "lucide-react";

/**
 * Props atualizadas para maior flexibilidade.
 */
type Props = {
  user: UserType;
  profile: Profile;
  // Opcionais para quando o perfil for apenas visualização
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  // Nova prop essencial: define se o usuário logado pode editar este perfil
  isOwner?: boolean;
  // Permite mudar o label do cargo/tipo (ex: "Despachante", "Cliente", "Administrador")
  roleLabel?: string;
};

export default function ProfileHeader({
  user,
  profile,
  isEditing = false,
  setIsEditing,
  isOwner = false,
  roleLabel = "Profissional",
}: Props) {

  // Atalho para verificar se podemos mostrar ações de edição
  const canEdit = isOwner && setIsEditing;

  return (
    <div className="w-full min-h-[13rem] flex justify-center mb-8">
      <div
        className={cn(
          "relative w-full bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-zinc-100",
          "flex flex-col md:flex-row items-center gap-6"
        )}
      >
        {/* =========================
            CONTAINER DE AÇÕES (Apenas se for o dono)
           ========================= */}
        {canEdit && (
          <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2">
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="cursor-pointer flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-95 border border-red-100"
              >
                <X size={16} />
                <span className="hidden sm:inline">Cancelar</span>
              </button>
            )}

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "cursor-pointer flex items-center gap-2 md:gap-3 px-4 py-1.5 md:px-6 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 shadow-sm",
                isEditing
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-[#21314D] text-white hover:bg-[#1A263D]"
              )}
            >
              {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
              <span>{isEditing ? "Salvar" : "Editar Perfil"}</span>
            </button>
          </div>
        )}

        {/* =========================
            FOTO DO USUÁRIO
           ========================= */}
        <div className="relative group shrink-0">
          <div
            className={cn(
              "w-28 h-28 md:w-36 md:h-36 rounded-full bg-zinc-100 border-4 border-white shadow-md overflow-hidden bg-cover bg-center transition-all",
              isEditing && "ring-4 ring-blue-100"
            )}
            style={{
              backgroundImage: `url(${profile.photo || "https://avatar.iran.liara.run/public/30"})`,
            }}
          />

          {isEditing && (
            <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-100 transition-opacity text-white border-2 border-dashed border-white/50">
              <Camera size={24} />
              <span className="text-[10px] font-bold mt-1 uppercase">Alterar</span>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          )}
        </div>

        {/* =========================
            INFORMAÇÕES DO USUÁRIO
           ========================= */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              {roleLabel}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
              {user.name}
            </h2>
          </div>

          {/* REDES SOCIAIS */}
          <div className="flex gap-5 pt-4">
            <SocialLink
              href={profile.instagram}
              icon={<InstagramIcon size={24} />}
              hoverClass="hover:text-[#E4405F]"
            />
            <SocialLink
              href={profile.whatsapp ? `https://wa.me/${profile.whatsapp}` : undefined}
              icon={<MessageCircle size={24} />}
              hoverClass="hover:text-[#25D366]"
            />
            <SocialLink
              href={profile.website}
              icon={<Globe size={24} />}
              hoverClass="hover:text-[#21314D]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente auxiliar para links sociais (limpa o JSX principal)
 */
function SocialLink({ href, icon, hoverClass }: { href?: string, icon: React.ReactNode, hoverClass: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn("text-zinc-300 transition-all hover:scale-110", hoverClass)}
    >
      {icon}
    </a>
  );
}
