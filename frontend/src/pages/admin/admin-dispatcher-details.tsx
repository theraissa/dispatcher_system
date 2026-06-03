import FormsContainer from "@/components/layout/form-container";
import FormCommercial from "@/components/record/dispatcher-record/form-dispatcher/form-commercial";
import FormPersonal from "@/components/record/dispatcher-record/form-dispatcher/form-personal";
import Navbar from "@/components/record/ui/navbar-with-title";
import { useDispatcherProfile } from "@/hooks/dispatcher/use-dispatcher-profile";
import { useAdminDispatchers } from "@/hooks/use-admin-dispatchers";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminDispatcherDetails() {
    const { dispatcherId } = useParams();
    const dispatcherIdNumber = Number(dispatcherId);

    const navigate = useNavigate();

    const { data: profile, loading: loadingProfile } = useDispatcherProfile(dispatcherIdNumber);
    const { updateStatus } = useAdminDispatchers();

    if (loadingProfile) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <p className="text-zinc-500 animate-pulse font-medium">Buscando dados completos do despachante...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4">
                <p className="text-zinc-600 font-semibold">Perfil do despachante não encontrado.</p>
                <button
                    onClick={() => navigate(FRONTEND_ROUTES.ADMIN.DISPATCHERS)}
                    className="text-sm font-bold text-[#21314D] underline"
                >
                    Voltar para a lista
                </button>
            </div >
        );
    }

    const handleApprove = async () => {
        await updateStatus(dispatcherIdNumber, "aprovado");
        navigate(FRONTEND_ROUTES.ADMIN.DISPATCHERS);
    };

    const handleReject = async () => {
        await updateStatus(dispatcherIdNumber, "negado");
        navigate(FRONTEND_ROUTES.ADMIN.DISPATCHERS);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-16">
            <Navbar title="Análise de Cadastro" />

            {/* HEADER CONTAINER */}
            <header className="pt-6 md:pt-10 px-8 md:px-16 max-w-[1400px] mx-auto w-full">

                {/* Botão de Voltar */}
                <button
                    onClick={() => navigate(FRONTEND_ROUTES.ADMIN.DISPATCHERS)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-[#21314D] font-bold text-sm mb-6 transition-colors"
                >
                    <ArrowLeft size={18} /> Voltar para a lista
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200/60 pb-6">

                    {/* Informações do Despachante */}
                    <div className="space-y-1.5">
                        <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                            Cadastro Pendente
                        </span>
                        <h1 className="text-3xl font-bold text-zinc-900">{profile.user.name}</h1>
                        <p className="text-zinc-500 text-sm">Criado em resposta à solicitação de ingresso no sistema.</p>
                    </div>

                    {/* Botões de Ação reposicionados estrategicamente no Topo */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleReject}
                            className="cursor-pointer flex items-center justify-center gap-2 px-5 h-12 rounded-xl font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors w-full md:w-auto"
                        >
                            <X size={16} /> Recusar
                        </button>

                        <button
                            onClick={handleApprove}
                            className="cursor-pointer flex items-center justify-center gap-2 px-6 h-12 rounded-xl font-bold text-sm text-white bg-[#21314D] hover:bg-[#1a273d] transition-colors w-full md:w-auto shadow-md shadow-[#21314D]/10"
                        >
                            <Check size={16} /> Aprovar Profissional
                        </button>
                    </div>

                </div>
            </header>

            {/* CONTAINER DOS FORMULÁRIOS */}
            <div className="w-full">
                <FormsContainer>
                    <FormPersonal
                        user={profile.user}
                        readOnly={true}
                        onChange={() => { }}
                        showPasswordFields={false}
                    />
                    <FormCommercial
                        dispatcher={profile.dispatcher}
                        address={profile.address}
                        readOnly={true}
                    />
                </FormsContainer>
            </div>
        </div>
    );
}
