// 1. Importe o hook customizado
import NavbarPage from "@/components/record/ui/navbar-page";
import { useAdminDispatchers } from "@/hooks/use-admin-dispatchers";
import { adminLinksNavbar, FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { ArrowRight, LayoutGrid, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminDashboardCard from "../../components/admin/dashboard-card";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // 2. Chame o hook aqui dentro para puxar os dados
  const { dispatchers, loading } = useAdminDispatchers();

  // 3. Substitua o número fixo pelo tamanho da lista (com fallback para 0 caso esteja carregando)
  const pendingDispatchers = dispatchers ? dispatchers.length : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">

      {/* Navbar superior com título dinâmico */}
      <NavbarPage links={adminLinksNavbar} />


      <div className="pt-6 md:pt-10 px-6 md:px-10 pb-16 max-w-7xl mx-auto">
        {/* CARD DE DESTAQUE (Banner) */}
        <div className="bg-[#21314D] p-8 rounded-[24px] shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-white">
            <div className="bg-white/10 p-4 rounded-xl">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">
                Pendências
              </p>

              {/* Mostra um feedback visual simples se o sistema estiver buscando os dados do servidor */}
              <h2 className="text-2xl font-bold">
                {loading ? (
                  <span className="opacity-50 animate-pulse">Carregando...</span>
                ) : (
                  `${pendingDispatchers} Despachantes aguardando`
                )}
              </h2>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/dispatcher")}
            className="w-full md:w-auto bg-white text-[#21314D] px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
          >
            Gerenciar <ArrowRight size={16} />
          </button>
        </div>

        {/* GRID DE ATALHOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminDashboardCard
            title="Serviços"
            description="Configuração do catálogo de serviços."
            icon={<LayoutGrid size={22} />}
            onClick={() => navigate(FRONTEND_ROUTES.ADMIN.SERVICES)}
          />

          <AdminDashboardCard
            title="Despachantes"
            description="Aprovação e gestão de profissionais."
            icon={<Users size={22} />}
            onClick={() => navigate(FRONTEND_ROUTES.ADMIN.DISPATCHERS)}
          />
        </div>

      </div>
    </div >
  );
}
