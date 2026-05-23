import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTicketChat } from "@/hooks/ticket/use-ticket-chat";
import type { TicketUserResponse } from "@/types/ticket.types";
import { formatDate } from "@/utils/formatters";
import { Send, User } from "lucide-react";
import { useState } from "react";


/**
 * Props do componente de chat do chamado.
 */
type TicketChatProps = {
    /**
     * ID do usuário autenticado (cliente ou despachante).
     * Usado para identificar autoria das mensagens.
     */
    userId: number;

    /**
     * Dados completos do chamado.
     * Contém informações do despachante e contexto do chat.
     */
    ticket: TicketUserResponse;
}

/**
 * Componente responsável pelo chat em tempo real (ou quase) de um chamado.
 *
 * Responsabilidades:
 * - Listar mensagens do chamado
 * - Diferenciar mensagens do usuário logado vs outro participante
 * - Enviar novas mensagens
 * - Manter estado local do input de mensagem
 *
 * Integração:
 * - Utiliza o hook `useTicketChat` para comunicação com backend
 */
export function TicketChat({ userId, ticket }: TicketChatProps) {

    // Hook responsável por buscar mensagens e enviar novas
    const { messages, handleSend } = useTicketChat(ticket.id, userId);

    // Estado local do input de mensagem
    const [message, setMessage] = useState("");

    /**
     * Handler de envio do formulário.
     * - Evita envio vazio
     * - Dispara envio via hook
     * - Limpa input após envio
     */
    function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!message.trim()) return;

        handleSend(message);
        setMessage("");
    }

    return (
        <section className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-zinc-100 overflow-hidden flex flex-col h-[500px] md:h-[600px] border-t-[6px] border-t-[#21314D]">

            {/* =========================
               HEADER DO CHAT
               ========================= */}
            <div className="p-4 md:p-5 border-b bg-zinc-50/50 flex items-center gap-3">
                <div className="flex items-center gap-3">

                    {/* Avatar placeholder */}
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F3EDE2] rounded-full flex items-center justify-center shrink-0">
                        <User size={20} className="text-[#21314D]" />
                    </div>

                    {/* Nome do outro participante (despachante) */}
                    <div>
                        <h3 className="text-sm md:text-base font-bold truncate">
                            {ticket.dispatcher.name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* =========================
               LISTA DE MENSAGENS
               ========================= */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-[#FAFAFA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
                {messages.map((msg) => {

                    // Verifica se a mensagem foi enviada pelo usuário atual
                    const isMe = msg.user_id === userId;

                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>

                                {/* BALÃO DA MENSAGEM */}
                                <div
                                    className={`relative p-4 text-sm md:text-base font-medium shadow-sm
                                        ${isMe
                                            ? 'bg-[#21314D] text-white rounded-2xl rounded-tr-none'
                                            : 'bg-white text-zinc-700 border border-zinc-100 rounded-2xl rounded-tl-none'
                                        }`}
                                >
                                    {msg.message}

                                    {/* "Rabicho" do balão */}
                                    <div
                                        className={`absolute top-0 w-4 h-4 
                                            ${isMe
                                                ? '-right-1 bg-[#21314D] [clip-path:polygon(0_0,0_100%,100%_0)]'
                                                : '-left-1 bg-white border-l border-t border-zinc-100 [clip-path:polygon(0_0,100%_0,100%_100%)]'
                                            }`}
                                    />
                                </div>

                                {/* Timestamp da mensagem */}
                                <span className="text-xs md:text-sm text-zinc-400 mt-1 font-bold">
                                    {formatDate(msg.created_at)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* =========================
               INPUT DE ENVIO
               ========================= */}
            <div className="p-4 md:p-6 bg-white border-t">
                <form
                    onSubmit={onSubmit}
                    className="flex gap-2 items-center bg-zinc-50 p-1.5 rounded-xl border border-zinc-100 focus-within:border-[#21314D]/30 focus-within:bg-white transition-all"
                >
                    <Input
                        placeholder="Escreva uma mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="text-sm md:text-base h-9 md:h-11 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                    />

                    <Button
                        type="submit"
                        disabled={!message.trim()}
                        className="h-10 px-4 bg-[#21314D] hover:bg-[#1A263D] rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-30"
                    >
                        <Send size={16} className="text-white" />
                    </Button>
                </form>
            </div>
        </section>
    );
}
