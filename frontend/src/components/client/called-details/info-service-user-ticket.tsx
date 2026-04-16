import type { TicketUserResponse } from "@/types/ticket.types";
import { formatDate } from "@/utils/formatters";
import { FileText, XCircle } from "lucide-react";


/**
 * Props do componente de exibição de informações do chamado.
 *
 * @property ticket - Objeto contendo todos os dados do chamado,
 * incluindo serviço, usuário e despachante.
 */
type InfoServiceAndUserProps = {
    ticket: TicketUserResponse;
    onCancel?: (id: number) => void;
};


/**
 * Componente responsável por exibir um resumo completo do chamado.
 *
 * Responsabilidades:
 * - Apresentar dados do serviço contratado
 * - Exibir informações do solicitante (usuário)
 * - Mostrar descrição/observações do serviço
 */
export function InfoServiceAndUser({ ticket, onCancel }: InfoServiceAndUserProps) {

    return (
        <section className="bg-white rounded-[32px] shadow-sm border border-zinc-100 overflow-hidden">

            {/* Cabeçalho Interno da Ficha */}
            <div className="bg-[#21314D] p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FileText size={20} className="text-zinc-300" />
                    <h3 className="font-bold tracking-wide uppercase text-sm">Resumo do Processo de Trânsito</h3>
                </div>
            </div>

            <div className="p-8 md:p-10 space-y-10">

                {/* GRID PRINCIPAL: INFORMAÇÕES DO SERVIÇO E CLIENTE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Coluna: Detalhes do Serviço */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-[#21314D] uppercase tracking-[0.2em] border-b pb-2 border-zinc-100">
                            Dados do Chamado
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4">
                            <DataField label="Nome do Serviço" value={ticket.service_details.name} />
                            <DataField label="Valor do Serviço" value={`R$ ${ticket.service_details.price}`} />
                            <DataField label="Data de Abertura" value={formatDate(ticket.created_at)} />
                            <DataField label="Data de Fechamento" value={formatDate(ticket.created_at)} />
                        </div>
                    </div>

                    {/* Coluna: Dados do Solicitante */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-[#21314D] uppercase tracking-[0.2em] border-b pb-2 border-zinc-100">
                            Dados do Solicitante
                        </h4>
                        <div className="grid grid-cols-1 gap-y-4">
                            <DataField label="Nome Completo" value={ticket.user.name} />
                            <div className="grid grid-cols-2 gap-4">
                                <DataField label="CPF/CNPJ" value={ticket.user.cpf} />
                                <DataField label="Telefone" value={ticket.user.contact} />
                                <DataField label="Email" value={ticket.user.email} />
                            </div>
                            <DataField label="Endereço Completo" value={ticket.user.address} />
                        </div>
                    </div>
                </div>

                {/* OBSERVAÇÕES TÉCNICAS */}
                <div>
                    <h4 className="text-xs font-black text-[#21314D] uppercase tracking-[0.2em] mb-3">
                        Observações do Serviço:
                    </h4>
                    <p className="text-zinc-600 text-sm leading-relaxed bg-zinc-50/50 p-4 rounded-xl border border-dashed border-zinc-200">
                        {ticket.service_details.description}
                    </p>
                </div>

                {/* BOTÃO DE CANCELAR */}
                <div className="flex justify-end items-center pt-4">
                    {ticket.status.toLowerCase() !== "cancelado" && (
                        <button
                            onClick={() => onCancel?.(ticket.id)}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-500/20 active:scale-95"
                        >
                            <XCircle size={16} />
                            Encerrar Chamado
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
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
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                {label}
            </span>

            <span className="text-sm font-semibold text-zinc-800">
                {value}
            </span>
        </div>
    );
}
