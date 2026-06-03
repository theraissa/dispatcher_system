import Navbar from "@/components/record/ui/navbar-with-title";
import { useAdminDispatchers } from "@/hooks/use-admin-dispatchers";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDispatcherList from "../../components/admin/dispatcher-list";

/**
 * Página de administração responsável por gerenciar despachantes pendentes.
 */
export default function AdminDispatchers() {
    // Hook de navegação entre rotas
    const navigate = useNavigate();

    // Estado local para controlar o texto de busca
    const [search, setSearch] = useState("");

    // Hook customizado que encapsula toda lógica de dados (fetch + update)
    const { dispatchers, loading, updateStatus } = useAdminDispatchers();

    /**
     * Filtra os despachantes com base no texto digitado.
     */
    const filtered = dispatchers.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleApprove = (id: number) => {
        updateStatus(id, "aprovado");
    };

    const handleReject = (id: number) => {
        updateStatus(id, "negado");
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">

            {/* Navbar superior colada no topo */}
            <Navbar title="Gerenciar Despachantes" />

            {/* CONTAINER DO CONTEÚDO*/}
            <div className="pt-6 md:pt-10 px-6 md:px-10 pb-16 max-w-5xl mx-auto">

                {/* =========================
                   BOTÃO DE VOLTAR
                   ========================= */}
                <button
                    onClick={() => navigate(FRONTEND_ROUTES.ADMIN.INITIAL)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-[#21314D] font-bold text-sm mb-6 transition-colors"
                >
                    <ArrowLeft size={18} /> Voltar ao Painel
                </button>

                {/* =========================
                   HEADER DA PÁGINA
                   ========================= */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">
                            Aprovações Pendentes
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            Gerencie o ingresso de novos profissionais no sistema.
                        </p>
                    </div>
                </header>

                {/* =========================
                   CAMPO DE BUSCA
                   ========================= */}
                <div className="relative mb-6 group">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por nome ou e-mail..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#21314D]/10 outline-none transition-all"
                    />
                </div>

                {/* =========================
                   LISTA DE DESPACHANTES
                   ========================= */}
                <div className="bg-white border border-zinc-100 rounded-[24px] p-2 md:p-6 shadow-sm">
                    <AdminDispatcherList
                        dispatchers={filtered}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onRowClick={(id) => navigate(FRONTEND_ROUTES.ADMIN.DISPATCHER_DETAILS.replace(":dispatcherId", String(id)))}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}
