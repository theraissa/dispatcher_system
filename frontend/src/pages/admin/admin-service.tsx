import ServiceModal from "@/components/admin/service-modal";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { adminService } from "@/services/admin-service";
import type { CreateServiceRequest, ServiceResponse } from "@/types/service.types";
import { ArrowLeft, Edit2, Eye, LayoutGrid, Plus, Search, Trash2 } from "lucide-react"; // Adicionado Eye
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminServices() {
    const navigate = useNavigate();

    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [editingService, setEditingService] = useState<ServiceResponse | null>(null);
    // 1. NOVO ESTADO: Controla se o modal abre apenas para leitura
    const [isViewOnly, setIsViewOnly] = useState(false);

    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadServices = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminService.listServices();
            setServices(response || []);
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadServices();
    }, [loadServices]);

    const handleSave = async (data: CreateServiceRequest) => {
        if (editingService) {
            await adminService.updateService(editingService.id, data);
        } else {
            await adminService.createService(data);
        }
        setIsModalOpen(false);
        loadServices();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Deseja realmente excluir este serviço?")) {
            await adminService.deleteService(id);
            loadServices();
        }
    };

    const filtered = services.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <div className="pt-6 md:pt-10 px-6 md:px-10 pb-16 max-w-7xl mx-auto">

                <button
                    onClick={() => navigate(FRONTEND_ROUTES.ADMIN.INITIAL)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-[#21314D] font-bold text-sm mb-6 transition-colors"
                >
                    <ArrowLeft size={18} /> Voltar ao Painel
                </button>

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Catálogo de Serviços</h1>
                        <p className="text-zinc-500 text-sm">Cadastre e gerencie os tipos de serviços do sistema.</p>
                    </div>

                    <button
                        onClick={() => { setEditingService(null); setIsViewOnly(false); setIsModalOpen(true); }}
                        className="bg-[#21314D] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#1A263D] transition-all shadow-lg"
                    >
                        <Plus size={18} /> Novo Serviço
                    </button>
                </header>

                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar serviço..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-white border border-zinc-200 rounded-[20px] text-sm focus:ring-2 focus:ring-[#21314D]/10 outline-none transition-all"
                    />
                </div>

                {loading ? (
                    <p className="text-center text-zinc-400 italic py-10 animate-pulse">Carregando serviços...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map(service => (
                            <div
                                key={service.id}
                                // 2. AJUSTADO: Clicar no card abre em modo de visualização
                                onClick={() => { setEditingService(service); setIsViewOnly(true); setIsModalOpen(true); }}
                                className="cursor-pointer bg-white p-6 rounded-[28px] border border-zinc-100 shadow-sm flex items-center justify-between group hover:border-[#21314D]/20 transition-all hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-zinc-50 p-3 rounded-2xl text-[#21314D] group-hover:bg-[#21314D]/5 transition-colors">
                                        <LayoutGrid size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1E1E1E]">{service.name}</h3>
                                        <p className="text-xs text-zinc-400 line-clamp-1">{service.description || "Sem descrição"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="cursor-pointer p-2.5 text-zinc-400 hover:text-[#21314D] hover:bg-zinc-50 rounded-xl transition-all">
                                        <Eye size={18} />
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingService(service);
                                            setIsViewOnly(false);
                                            setIsModalOpen(true);
                                        }}
                                        className="cursor-pointer p-2.5 text-zinc-400 hover:text-[#21314D] hover:bg-zinc-50 rounded-xl transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(service.id);
                                        }}
                                        className="cursor-pointer p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {!loading && filtered.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white rounded-[28px] border border-dashed border-zinc-200">
                                <p className="text-zinc-500 text-sm">Nenhum serviço encontrado para "{search}".</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ServiceModal
                key={editingService?.id ?? "new"}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingService={editingService}
                readOnly={isViewOnly}
            />
        </div >
    );
}
