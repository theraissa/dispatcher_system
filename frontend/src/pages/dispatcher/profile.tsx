import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthRequired } from "@/hooks/auth/auth-requirered"
import { dispatcherLinksNavbar } from "@/routes/frontend-routes"
import { Briefcase, UserCircle } from "lucide-react"
import ProfileInfo from "../../components/dispatcher/profile/profile-info"
import ProfileServices from "../../components/dispatcher/profile/profile-services"
import NavbarPage from "../../components/record/ui/navbar-page"

/**
 * Página principal do perfil do despachante.
 */
export default function ProfilePage() {
  const { user } = useAuthRequired();

  if (!user?.dispatcherId) {
    return <div className="min-h-screen bg-[#F3EDE2] flex items-center justify-center font-bold">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F3EDE2]">
      <NavbarPage
        title="Central do Despachante"
        shortTitle="D"
        links={dispatcherLinksNavbar}
      />

      <main className="max-w-[1800px] mx-auto px-6 md:px-10 py-10">
        <Tabs
          defaultValue="info"
          orientation="horizontal"
          className="!flex flex-col lg:!flex-row gap-8 items-start w-full"
        >

          {/* =========================
              CONTEÚDO PRINCIPAL (ESQUERDA)
             ========================= */}
          <div className="w-full lg:flex-[3] order-2 lg:order-1">
            <TabsContent value="info" className="mt-0 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <ProfileInfo dispatcherId={user.dispatcherId} userId={user.id} />
            </TabsContent>

            <TabsContent value="services" className="mt-0 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <ProfileServices dispatcherId={user.dispatcherId} />
            </TabsContent>
          </div>

          {/* =========================
              MENU LATERAL (DIREITA)
             ========================= */}
          <aside className="w-full lg:w-[350px] bg-white/50 backdrop-blur-sm p-5 rounded-[32px] shadow-sm border border-white/20 relative lg:sticky lg:top-6 order-1 lg:order-2">

            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest ml-3 mb-4">
              Menu Perfil
            </p>

            {/* AJUSTE AQUI: Adicionado !h-auto e !flex para anular os limites internos do Shadcn */}
            <TabsList className="w-full !h-auto bg-transparent p-0 border-0 !flex flex-row lg:flex-col gap-3 justify-start rounded-none">
              <TabsTrigger
                value="info"
                className="cursor-pointer w-full justify-start gap-3 p-4 rounded-xl text-[15px] font-bold text-zinc-500 bg-white shadow-none transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-500 data-[state=active]:bg-[#21314D] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:scale-[1.03] focus-visible:ring-0"
              >
                <UserCircle size={18} />
                <span className="truncate">Seus Dados</span>
              </TabsTrigger>

              <TabsTrigger
                value="services"
                className="cursor-pointer w-full justify-start gap-3 p-4 rounded-xl text-[15px] font-bold text-zinc-500 bg-white shadow-none transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-500 data-[state=active]:bg-[#21314D] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:scale-[1.03] focus-visible:ring-0"
              >
                <Briefcase size={18} />
                <span className="truncate">Seus Serviços</span>
              </TabsTrigger>
            </TabsList>
          </aside>

        </Tabs>
      </main>
    </div>
  )
}
