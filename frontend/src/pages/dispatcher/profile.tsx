import { useAuthRequired } from "@/hooks/auth/auth-requirered"
import { cn } from "@/lib/utils"
import { dispatcherLinksNavbar } from "@/routes/frontend-routes"
import { Briefcase, UserCircle } from "lucide-react"
import { useState } from "react"
import ProfileInfo from "../../components/dispatcher/profile/profile-info"
import ProfileServices from "../../components/dispatcher/profile/profile-services"
import NavbarPage from "../../components/record/ui/navbar-page"

/**
 * Página principal do perfil do despachante.
 */
export default function ProfilePage() {
  const [tab, setTab] = useState<"info" | "services">("info")
  const { user } = useAuthRequired();

  if (!user?.dispatcherId) {
    return <div className="min-h-screen bg-[#F3EDE2] flex items-center justify-center font-bold">Carregando...</div>;
  }

  const menuButtonStyles = (isActive: boolean) =>
    cn(
      "cursor-pointer flex items-center gap-3 w-full p-4 rounded-xl text-[15px] font-bold transition-all duration-200",
      isActive
        ? "bg-[#21314D] text-white shadow-md scale-[1.03]"
        : "bg-white text-zinc-500 hover:bg-zinc-50"
    );

  return (
    <div className="min-h-screen bg-[#F3EDE2]">
      <NavbarPage
        title="Central do Despachante"
        shortTitle="D"
        links={dispatcherLinksNavbar}
      />

      <main className="max-w-[1800px] mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* =========================
              CONTEÚDO PRINCIPAL (ESQUERDA)
             ========================= */}
          <div className="w-full lg:flex-[3] order-2 lg:order-1">
            {tab === "info" && (
              <ProfileInfo
                dispatcherId={user.dispatcherId}
                userId={user.id}
              />
            )}

            {tab === "services" && (
              <ProfileServices
                dispatcherId={user.dispatcherId}
              />
            )}
          </div>

          {/* =========================
              MENU LATERAL (DIREITA)
             ========================= */}
          <aside className="w-full lg:w-[350px] bg-white/50 backdrop-blur-sm p-5 rounded-[32px] shadow-sm border border-white/20 sticky top-6 order-1 lg:order-2">

            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest ml-3 mb-4">
              Menu Perfil
            </p>

            {/* No mobile os botões ficam lado a lado, no desktop ficam um embaixo do outro */}
            <div className="flex flex-row lg:flex-col gap-3">
              <button
                onClick={() => setTab("info")}
                className={menuButtonStyles(tab === "info")}
              >
                <UserCircle size={18} />
                <span className="truncate">Seus Dados</span>
              </button>

              <button
                onClick={() => setTab("services")}
                className={menuButtonStyles(tab === "services")}
              >
                <Briefcase size={18} />
                <span className="truncate">Seus Serviços</span>
              </button>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}
