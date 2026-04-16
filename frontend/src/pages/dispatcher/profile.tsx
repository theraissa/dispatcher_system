import { useState } from "react"
import NavbarPage from "../../components/record/ui/navbar-page"
import ProfileInfo from "../../components/dispatcher/profile/profile-info"
import ProfileServices from "../../components/dispatcher/profile/profile-services"
import { cn } from "@/lib/utils"
import { UserCircle, Briefcase } from "lucide-react"
import { dispatcherLinksNavbar } from "@/routes/frontend-routes"
import { useAuth } from "@/hooks/use-auth"


/**
 * Página principal do perfil do despachante.
 *
 * Responsável por centralizar:
 * - Informações pessoais e comerciais do perfil
 * - Gestão de serviços vinculados ao despachante
 * - Navegação entre abas internas da área de perfil
 */
export default function ProfilePage() {

  // Controla a aba ativa da página de perfil.
  const [tab, setTab] = useState<"info" | "services">("info")

  const { user } = useAuth();

  if (!user?.dispatcherId) {
    return <div>Carregando usuário...</div>;
  }

  // Classe dinâmica para botões do menu lateral.
  const menuButtonStyles = (isActive: boolean) =>
    cn(
      "cursor-pointer flex items-center gap-3 w-full p-4 rounded-xl text-[15px] font-bold transition-all duration-200",
      isActive
        ? "bg-[#21314D] text-white shadow-md scale-[1.03]"
        : "bg-white text-zinc-500"
    );

  return (
    <div className="min-h-screen bg-[#F3EDE2]">

      {/* =========================
          NAVBAR GLOBAL
         ========================= */}
      <NavbarPage
        title="Central do Despachante"
        shortTitle="D"
        links={dispatcherLinksNavbar}
      />

      <main className="max-w-[1800px] mx-auto px-6 md:px-10 py-10 transition-all">

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* =========================
              CONTEÚDO PRINCIPAL (ESQUERDA)
             ========================= */}
          <div className="flex-[3] w-full order-2 lg:order-1 transition-">

            {/* Aba: Informações do perfil */}
            {tab === "info" && (
              <ProfileInfo
                dispatcherId={user.dispatcherId}
                userId={user.id}
              />
            )}

            {/* Aba: Serviços do despachante */}
            {tab === "services" && (
              <ProfileServices
                dispatcherId={user.dispatcherId}
              />
            )}
          </div>

          {/* =========================
              MENU LATERAL (DIREITA)
             ========================= */}
          <aside className="lg:w-[300px] h-52 bg-white/50 backdrop-blur-sm p-5 rounded-[32px] shadow-sm border border-white/20 sticky top-6 order-1 lg:order-2">

            {/* Título do menu */}
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest ml-3 mb-4">
              Menu Perfil
            </p>

            {/* Botões de navegação entre abas */}
            <div className="flex flex-row lg:flex-col gap-3">

              {/* Aba: Informações */}
              <button
                onClick={() => setTab("info")}
                className={menuButtonStyles(tab === "info")}
              >
                <UserCircle size={18} />
                Seus Dados
              </button>

              {/* Aba: Serviços */}
              <button
                onClick={() => setTab("services")}
                className={menuButtonStyles(tab === "services")}
              >
                <Briefcase size={18} />
                Seus Serviços
              </button>

            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}
