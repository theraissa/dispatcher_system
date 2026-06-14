import { useTickets } from "@/hooks/ticket/use-ticket";
import { useServiceDetails } from "@/hooks/use-service-details";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import * as Accordion from "@radix-ui/react-accordion";
import { Check, ChevronDown, FileText, Info, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Componente responsável por exibir os serviços oferecidos por um despachante
 * em formato de accordion (expansível).
 */
export default function AccordionServiceDispatcher({ userId, dispatcherId }: { userId: number, dispatcherId: number }) {
    const navigate = useNavigate();

    // Busca os serviços do despachante
    const { serviceDetails, loading } = useServiceDetails(dispatcherId);

    // Hook para criação de chamados
    const { handleCreateTicket, loading: creatingTicket } = useTickets(userId);

    const onSolicitarAtendimento = async (serviceDetailsId: number) => {
        try {
            await handleCreateTicket({
                user_id: userId,
                dispatcher_id: dispatcherId,
                service_details_id: serviceDetailsId,
            });

            toast.success("Chamado criado com sucesso!");
            navigate(FRONTEND_ROUTES.CLIENT.TICKET);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <section className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-zinc-100 h-fit w-full">
            {/* Cabeçalho da seção fixo e estável */}
            <div className="mb-10">
                <h3 className="text-2xl font-bold tracking-tight text-[#1E1E1E]">
                    Serviços Oferecidos
                </h3>
                <p className="text-zinc-400 text-sm mt-1 font-medium">
                    Consulte as taxas e documentos necessários.
                </p>
            </div>

            <div className="overflow-y-auto max-h-[700px] pr-2 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">

                {/* 1. MELHORIA NO CARREGAMENTO: Skeletons discretos imitando as barras do Accordion */}
                {loading && (
                    <div className="space-y-3 aria-hidden='true'">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="flex items-center justify-between p-5 border border-zinc-100 rounded-2xl animate-pulse bg-white">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
                                    <div className="h-4 bg-zinc-100 rounded w-1/3" />
                                </div>
                                <div className="w-5 h-5 bg-zinc-100 rounded-full" />
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. MELHORIA NO ESTADO VAZIO: Um aviso centralizado elegante com ícone */}
                {!loading && (!serviceDetails || serviceDetails.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-3">
                            <Info size={20} strokeWidth={1.8} />
                        </div>
                        <p className="text-zinc-500 font-semibold text-sm text-center">
                            Nenhum serviço disponível no momento.
                        </p>
                        <p className="text-zinc-400 text-xs text-center mt-0.5">
                            Este despachante ainda não vinculou nenhum serviço ao seu perfil.
                        </p>
                    </div>
                )}

                {/* Renderização principal quando os dados existem e terminou de carregar */}
                {!loading && serviceDetails && serviceDetails.length > 0 && (
                    <Accordion.Root type="single" collapsible className="space-y-3">
                        {serviceDetails.map((service, idx) => (
                            <Accordion.Item
                                key={service.id}
                                value={`item-${idx}`}
                                className="border border-zinc-100 rounded-2xl overflow-hidden transition-all data-[state=open]:border-zinc-200 data-[state=open]:bg-zinc-50/30"
                            >
                                <Accordion.Header>
                                    <Accordion.Trigger className="flex items-center justify-between w-full p-5 text-left hover:bg-zinc-50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 group-data-[state=open]:text-[#21314D] transition-colors">
                                                <FileText size={18} />
                                            </div>
                                            <span className="font-bold text-zinc-800">
                                                {service.service_name}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            size={18}
                                            className="text-zinc-400 group-data-[state=open]:rotate-180 transition-transform"
                                        />
                                    </Accordion.Trigger>
                                </Accordion.Header>

                                <Accordion.Content className="animate-in slide-in-from-top-2 duration-200">
                                    <div className="px-5 pb-5">
                                        <div className="bg-white rounded-xl p-6 border border-zinc-100 shadow-sm">
                                            {service.price && (
                                                <p className="text-sm font-bold text-[#21314D] mb-4">
                                                    Valor: R$ {service.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                                </p>
                                            )}

                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                                                Documentação Necessária:
                                            </p>

                                            <ul className="space-y-2 mb-4">
                                                <li className="flex items-center gap-2 text-sm text-zinc-600">
                                                    <Check size={14} className="text-green-500" />
                                                    Documentação será informada no atendimento
                                                </li>
                                            </ul>

                                            <button
                                                onClick={() => onSolicitarAtendimento(service.id)}
                                                disabled={creatingTicket}
                                                className="cursor-pointer bg-[#21314D] text-white h-12 w-full rounded-xl font-bold text-xs hover:bg-[#1A263D] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                                            >
                                                {creatingTicket ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    "Solicitar Atendimento"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </Accordion.Content>
                            </Accordion.Item>
                        ))}
                    </Accordion.Root>
                )}
            </div>
        </section>
    );
}
