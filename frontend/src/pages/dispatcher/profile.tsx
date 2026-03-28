import { useState } from "react"
import NavbarPage from "../../components/record/ui/navbar-page"
import ProfileInfo from "../../components/dispatcher/profile/profile-info"
import ProfileServices from "../../components/dispatcher/profile/profile-services"
import { cn } from "@/lib/utils"
import { UserCircle, Briefcase } from "lucide-react"


export default function ProfilePage() {
  const [tab, setTab] = useState<"info" | "services">("info")

  const menuButtonStyles = (isActive: boolean) => cn(
    "flex items-center gap-3 w-full p-3 rounded-xl text-sm font-bold transition-all duration-200",
    isActive
      ? "bg-[#21314D] text-white shadow-md scale-[1.02]"
      : "bg-white text-zinc-500 hover:bg-zinc-50 hover:text-[#21314D]"
  );

  return (
    <div className="min-h-screen bg-[#F3EDE2]">
      <NavbarPage />

      <main className="max-w-[1700px] mx-auto px-6 md:px-10 py-10 transition-all">

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Conteúdo Principal (Esquerda) */}
          <div className="flex-[3] w-full order-2 lg:order-1 transition-all">
            {tab === "info" && <ProfileInfo />}
            {tab === "services" && <ProfileServices />}
          </div>

          {/* Menu Lateral (Direita) */}
          <aside className="w-full lg:w-[220px] flex-shrink-0 bg-white/50 backdrop-blur-sm p-4 rounded-[32px] shadow-sm border border-white/20 sticky top-6 order-1 lg:order-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-3 mb-4">
              Menu Perfil
            </p>

            <div className="flex flex-row lg:flex-col gap-2">
              <button
                onClick={() => setTab("info")}
                className={menuButtonStyles(tab === "info")}
              >
                <UserCircle size={18} />
                Informações
              </button>

              <button
                onClick={() => setTab("services")}
                className={menuButtonStyles(tab === "services")}
              >
                <Briefcase size={18} />
                Serviços
              </button>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}
