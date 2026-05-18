import { InstagramIcon } from "@/components/icons/lucide-instagram";
import { cn } from "@/lib/utils";
import type { UserType } from "@/types/type";
import { Camera, Edit3, Globe, Save, X } from "lucide-react";
import { useState } from "react";

type ProfileHeaderProps = {
  user: UserType;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  isOwner?: boolean;
  roleLabel?: string;
  onChangeData?: (publicData: { instagram?: string; website?: string; photoFile?: File }) => void;
};

export default function ProfileHeader({
  user,
  isEditing = false,
  setIsEditing,
  isOwner = false,
  roleLabel = "Profissional",
  onChangeData,
}: ProfileHeaderProps) {
  const canEdit = isOwner && !!setIsEditing;

  // Estados locais para controlar os inputs de edição pública
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [photoPreview, setPhotoPreview] = useState(user?.photo || "");
  const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);

  // 1. Funções controladas de mudança para os inputs de texto
  const handleInstagramChange = (val: string) => {
    setInstagram(val);
    if (onChangeData) {
      onChangeData({ instagram: val, website, photoFile });
    }
  };

  const handleWebsiteChange = (val: string) => {
    setWebsite(val);
    if (onChangeData) {
      onChangeData({ instagram, website: val, photoFile });
    }
  };

  // 2. Trata a seleção da imagem pelo input file
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));

      if (onChangeData) {
        onChangeData({ instagram, website, photoFile: file });
      }
    }
  };

  const handleEditClick = () => {
    if (!setIsEditing) return;
    if (!isEditing) {
      setIsEditing(true);
      // Já avisa o pai com os dados atuais ao abrir a edição
      if (onChangeData) {
        onChangeData({ instagram, website, photoFile });
      }
    }
  };

  return (
    <div className="w-full justify-center mb-8">
      <div
        className={cn(
          "relative w-full bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-zinc-100",
          "flex flex-col md:flex-row items-center gap-6"
        )}
      >
        {/* =========================
            CONTAINER DE AÇÕES
           ========================= */}
        {canEdit && (
          <div className="order-3 md:order-none md:absolute md:top-8 md:right-8 flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing && setIsEditing(false)}
                className="flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100"
              >
                <X size={16} />
                <span>Cancelar</span>
              </button>
            )}

            <button
              type={isEditing ? "submit" : "button"}
              onClick={handleEditClick}
              className={cn(
                "flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm",
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
              "w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-100 border-4 border-white shadow-md overflow-hidden bg-cover bg-center transition-all",
              isEditing && "ring-4 ring-blue-100"
            )}
            style={{
              backgroundImage: `url(${photoPreview
                ? (photoPreview.startsWith("blob:") ? photoPreview : `${import.meta.env.VITE_API_URL}${photoPreview}`)
                : "https://avatar.iran.liara.run/public/30"
                })`,
            }}
          />

          {isEditing && (
            <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-100 transition-opacity text-white border-2 border-dashed border-white/50">
              <Camera size={22} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Alterar</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
          )}
        </div>

        {/* =========================
            INFORMAÇÕES E INPUTS
           ========================= */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-2 w-full">
          <div className="space-y-0.5">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              {roleLabel}
            </p>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
              {user.name}
            </h2>
            {!isEditing && user && (
              <p className="text-zinc-500 text-sm md:text-base font-medium">{user.email}</p>
            )}
          </div>

          {/* FLUXO MODO EDIÇÃO */}
          {isEditing ? (
            <div className="w-full max-w-md grid grid-cols-1 gap-2 pt-2">
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 focus-within:border-[#21314D]/30 transition-all">
                <InstagramIcon size={18} className="text-zinc-400" />
                <input
                  type="text"
                  placeholder="Link do Instagram"
                  value={instagram}
                  // Alterado para chamar o handler controlado
                  onChange={(e) => handleInstagramChange(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none text-[#1E1E1E]"
                />
              </div>

              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 focus-within:border-[#21314D]/30 transition-all">
                <Globe size={18} className="text-zinc-400" />
                <input
                  type="text"
                  placeholder="Website ou Portfólio"
                  value={website}
                  // Alterado para chamar o handler controlado
                  onChange={(e) => handleWebsiteChange(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none text-[#1E1E1E]"
                />
              </div>
            </div>
          ) : (
            /* FLUXO MODO VISUALIZAÇÃO */
            user && (
              <div className="flex gap-5 pt-2">
                <SocialLink
                  href={user.instagram}
                  icon={<InstagramIcon size={22} />}
                  hoverClass="hover:text-[#E4405F]"
                />
                <SocialLink
                  href={user.website}
                  icon={<Globe size={22} />}
                  hoverClass="hover:text-[#21314D]"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function SocialLink({ href, icon, hoverClass }: { href?: string; icon: React.ReactNode; hoverClass: string }) {
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
