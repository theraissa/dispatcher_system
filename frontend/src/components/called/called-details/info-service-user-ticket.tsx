import { useTicketTimeline } from "@/hooks/ticket/use-ticket-timeline";
import type { TicketUserResponse } from "@/types/ticket.types";
import { formatDate } from "@/utils/formatters";
import { FileText, XCircle } from "lucide-react";
import { toast } from "sonner";


/**
 * Props do componente de exibição de informações do chamado.
 *
 * @property ticket - Objeto contendo todos os dados do chamado,
 * incluindo serviço, usuário e despachante.
 */
type InfoServiceAndUserProps = {
    ticket: TicketUserResponse;
    isDispatcher?: boolean;

};


/**
 * Componente responsável por exibir um resumo completo do chamado.
 *
 * Responsabilidades:
 * - Apresentar dados do serviço contratado
 * - Exibir informações do solicitante (usuário)
 * - Mostrar descrição/observações do serviço
 */
export function InfoServiceAndUser({ ticket, isDispatcher = false }: InfoServiceAndUserProps) {

    const { createTimeline, refetch } = useTicketTimeline(ticket.id);

    // Função que efetivamente encerra o chamado após a confirmação
    async function executeCancellation() {
        try {
            await createTimeline({
                status: "encerrado",
                description: "Chamado encerrado pelo usuário devido a conflito ou impedimento.",
            });
            await refetch();
            toast.success("Chamado encerrado com sucesso.");
        } catch (error) {
            console.error("Erro ao encerrar chamado:", error);
            toast.error("Não foi possível encerrar o chamado.");
        }
    }

    // Intercepta o clique e joga a responsabilidade de confirmação para o Sonner
    function handleCancelConfirmation() {
        toast.warning("Tem certeza que deseja encerrar?", {
            description: "Esta ação indica que houve algum impedimento que impossibilitou o andamento do processo.",
            duration: Infinity,
            action: {
                label: "Sim, encerrar",
                onClick: () => executeCancellation(),
            },
            cancel: {
                label: "Voltar",
                onClick: () => toast.dismiss(),
            },

        });
    }

    return (
        <section className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border overflow-hidden">

            {/* Cabeçalho */}
            <div className="bg-[#21314D] p-4 md:p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FileText size={18} className="text-zinc-300 shrink-0" />
                    <h3 className="font-bold uppercase text-sm md:text-base tracking-widest">Resumo do Processo</h3>
                </div>
            </div>

            <div className="p-6 md:p-10 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    {/* Coluna: Detalhes do Serviço */}
                    <div className="lg:col-span-5 space-y-6">
                        <h4 className="text-xs md:text-sm font-black text-[#21314D] uppercase tracking-[0.2em] border-b pb-2">
                            Dados do Chamado
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                            <DataField label="Nome do Serviço" value={ticket.service_details.name} />
                            <DataField label="Valor do Serviço" value={`R$ ${ticket.service_details.price}`} />
                            <DataField label="Data de Abertura" value={formatDate(ticket.created_at)} />
                            {ticket.deleted_at && (
                                <DataField label="Data de Fechamento" value={formatDate(ticket.deleted_at)} />
                            )}
                        </div>
                    </div>

                    {/* Coluna: Dados do Solicitante */}
                    <div className="lg:col-span-6 space-y-6">
                        <h4 className="text-xs md:text-sm font-black text-[#21314D] uppercase tracking-[0.2em] border-b pb-2">
                            Dados do Solicitante
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            {/* Nome ocupa as duas colunas se necessário */}
                            <div className="md:col-span-2">
                                <DataField label="Nome Completo" value={ticket.user.name} />
                            </div>

                            <DataField label="CPF/CNPJ" value={ticket.user.cpf} />
                            <DataField label="Telefone" value={ticket.user.contact} />

                            {/* Email em linha cheia para evitar aperto */}
                            <div className="md:col-span-2">
                                <DataField label="E-mail" value={ticket.user.email} />
                            </div>

                            <div className="md:col-span-2">
                                <DataField label="Endereço Completo" value={ticket.user.address} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* OBSERVAÇÕES TÉCNICAS */}
                <div className="pt-4">
                    <h4 className="text-xs md:text-sm font-black text-[#21314D] uppercase tracking-[0.2em] mb-4">
                        Observações do Serviço:
                    </h4>
                    <p className="text-zinc-600 text-sm md:text-[15px] leading-relaxed bg-zinc-50/50 p-5 rounded-2xl border border-zinc-200">
                        {ticket.service_details.description}
                    </p>
                </div>

                {/* ========================================================
                        ÁREA DE AÇÕES / BOTÃO DE CANCELAR
                    ======================================================== */}
                {(() => {
                    if (isDispatcher) return null
                    // Normaliza o status atual para evitar problemas de caixa alta/baixa
                    const currentStatus = ticket.status.toLowerCase();

                    // Define uma lista com todos os status considerados "finais"
                    const isFinishedOrClosed =
                        currentStatus.includes("concluído") ||
                        currentStatus.includes("finalizado") ||
                        currentStatus.includes("encerrado") ||
                        currentStatus.includes("cancelado");

                    // Só renderiza a div e o botão se o chamado NÃO estiver finalizado/encerrado
                    if (isFinishedOrClosed) return null;

                    return (
                        <div className="flex justify-end pt-6 border-t">
                            <button
                                onClick={handleCancelConfirmation}
                                className="cursor-pointer flex items-center gap-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border border-red-200 active:scale-95"
                            >
                                <XCircle size={16} />
                                Encerrar Chamado
                            </button>
                        </div>
                    );
                })()}
            </div>
        </section>
    );
}


/**
 * Componente auxiliar para exibição de um campo label + valor.
 *
 * Responsabilidades:
 * - Padronizar a apresentação de dados
 * - Evitar repetição de markup
 *
 * @param label - Nome do campo (ex: "Nome", "CPF")
 * @param value - Valor a ser exibido
 */
function DataField({ label, value }: { label: string; value: string | number; }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {label}
            </span>
            <span className="text-sm md:text-[15px] font-semibold text-zinc-800 break-words">
                {value || "---"}
            </span>
        </div>
    );
}
