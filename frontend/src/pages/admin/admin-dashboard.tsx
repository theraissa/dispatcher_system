import { useNavigate } from "react-router-dom";
import { Users, LayoutGrid, ArrowRight, ShieldCheck } from "lucide-react";
import AdminDashboardCard from "../../components/admin/dashboard-card";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const pendingDispatchers = 3;

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans">

      {/* HEADER SIMPLES */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Painel Administrativo</h1>
        <p className="text-zinc-500 text-sm">Gerencie o sistema de forma centralizada.</p>
      </header>

      {/* CARD DE DESTAQUE (Banner) */}
      <div className="bg-[#21314D] p-8 rounded-[24px] shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-white">
          <div className="bg-white/10 p-4 rounded-xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">Pendências</p>
            <h2 className="text-2xl font-bold">{pendingDispatchers} Despachantes aguardando</h2>
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
          onClick={() => navigate("/admin/services")}
        />

        <AdminDashboardCard
          title="Despachantes"
          description="Aprovação e gestão de profissionais."
          icon={<Users size={22} />}
          onClick={() => navigate("/admin/dispatcher")}
        />
      </div>

    </div>
  );
}
