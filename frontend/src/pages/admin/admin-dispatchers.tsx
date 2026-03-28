import { useState } from "react";
import { Search, ArrowLeft, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminDispatcherList from "../../components/admin/dispatcher-list";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { useAdminDispatchers } from "@/hooks/use-admin-dispatchers";


export default function AdminDispatchers() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const { dispatchers, loading, approve, reject } = useAdminDispatchers();

    const filtered = dispatchers.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-10">
            {/* Voltar e Header */}
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(FRONTEND_ROUTES.ADMIN.ROOT)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-[#21314D] font-bold text-sm mb-6 transition-colors"
                >
                    <ArrowLeft size={18} /> Voltar ao Painel
                </button>

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Aprovações Pendentes</h1>
                        <p className="text-zinc-500 text-sm">Gerencie o ingresso de novos profissionais no sistema.</p>
                    </div>

                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                        <ShieldAlert size={16} />
                        {dispatchers.length} aguardando
                    </div>
                </header>

                {/* Busca */}
                <div className="relative mb-6 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Filtrar por nome ou e-mail..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#21314D]/10 outline-none transition-all"
                    />
                </div>

                {/* Lista */}
                <div className="bg-white border border-zinc-100 rounded-[24px] p-2 md:p-6 shadow-sm">
                    <AdminDispatcherList
                        dispatchers={filtered}
                        onApprove={approve}
                        onReject={reject}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}
