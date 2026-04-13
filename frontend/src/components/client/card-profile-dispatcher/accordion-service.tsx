import { ChevronDown, FileText, Check, Loader2 } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { useServiceDetails } from "@/hooks/use-service-details";
import { useTickets } from "@/hooks/use-ticket";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AccordionServiceDispatcher({ userId, dispatcherId }: { userId: number, dispatcherId: number }) {

    const navigate = useNavigate();

    const { serviceDetails, loading } = useServiceDetails(dispatcherId);
    const { handleCreateTicket, loading: creatingTicket } = useTickets(userId);

    if (loading) {
        return <p className="text-zinc-400">Carregando serviços...</p>;
    }
    if (!serviceDetails || serviceDetails.length === 0) {
        return <p className="text-zinc-400">Nenhum serviço disponível.</p>;
    }

    const onSolicitarAtendimento = async (serviceDetailsId: number) => {
        try {
            await handleCreateTicket({
                user_id: userId,
                dispatcher_id: dispatcherId,
                service_details_id: serviceDetailsId,
            });
            toast.success("Chamado criado com sucesso!");
            navigate(FRONTEND_ROUTES.CLIENT.CALLED);
        } catch (error: any) {
            toast.error(error.message);
        }
    };


    return (
        <section className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-zinc-100 h-fit">
            <div className="mb-10">
                <h3 className="text-2xl font-bold tracking-tight text-[#1E1E1E]">
                    Serviços Oferecidos
                </h3>
                <p className="text-zinc-400 text-sm mt-1 font-medium">
                    Consulte as taxas e documentos necessários.
                </p>
            </div>

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

                                    {/* 🔥 Nome do serviço vindo da API */}
                                    <span className="font-bold text-zinc-800">
                                        {service.name}
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

                                    {/* Preço do serviço */}
                                    {service.price && (
                                        <p className="text-sm font-bold text-[#21314D] mb-4">
                                            Valor: R$ {service.price}
                                        </p>
                                    )}

                                    {/* Placeholder (até você ter docs reais) */}
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
                                        onClick={() => onSolicitarAtendimento(service.service_id)}
                                        disabled={creatingTicket}
                                        className="bg-[#21314D] text-white h-12 w-full rounded-xl font-bold text-xs hover:bg-[#1A263D] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
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
        </section>
    );
}
