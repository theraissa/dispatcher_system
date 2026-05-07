import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Phone, ShieldCheck, Star, User } from "lucide-react";


/**
 * Props do componente AsideProfileDispatcher.
 */
type AsideProfileDispatcherProps = {
    dispatcher: {
        user: Record<string, any>;
        office: Record<string, any>;
    };
    onOpenReview: () => void;
    canReview?: boolean;
};

/**
 * Componente responsável por exibir o resumo do perfil de um despachante.
 *
 * Esse componente funciona como um "aside informativo", apresentando:
 * - Identidade visual do profissional (avatar + nome)
 * - Informações de contato e localização
 * - Indicação de credenciamento
 * - Área de avaliação do atendimento
 */
export function AsideProfileDispatcher({ dispatcher, onOpenReview, canReview = false }: AsideProfileDispatcherProps) {
    return (
        <aside className="w-full">
            <div className="bg-white p-6 md:p-8 rounded-[28px] md:rounded-[32px] shadow-sm border border-zinc-100 lg:sticky lg:top-24 border-t-[6px] border-t-[#21314D]">
                {/* =========================
                   AVATAR + INDICADOR DE VERIFICAÇÃO
                   ========================= */}
                <div className="relative w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 md:mb-6">
                    {/* Avatar padrão (fallback visual) */}
                    <div className="w-full h-full bg-zinc-50 rounded-[20px] md:rounded-[24px] flex items-center justify-center text-zinc-300 border border-zinc-100">
                        <User size={48} strokeWidth={1.5} />
                    </div>

                    {/* Badge de verificação (credibilidade do profissional) */}
                    <div className="absolute -bottom-1 -right-1 bg-[#21314D] p-1.5 rounded-lg shadow-md border-2 border-white">
                        <ShieldCheck size={16} className="text-white" />
                    </div>
                </div>

                {/* =========================
                   IDENTIDADE DO PROFISSIONAL
                   ========================= */}
                <div className="text-center mb-6">
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-[#1E1E1E]">
                        {dispatcher.user.name}
                    </h2>

                    {/* Label institucional para reforçar confiança */}
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        Profissional Credenciado
                    </p>
                </div>

                {/* =========================
                   INFORMAÇÕES DE CONTATO
                   ========================= */}
                <div className="space-y-1">

                    <InfoDispatcherRow
                        icon={<MapPin size={24} strokeWidth={2} />}
                        label="Localização"
                        value={`${dispatcher.office.address}, ${dispatcher.office.number}`}
                        subValue={`${dispatcher.office.neighborhood} - ${dispatcher.office.city}, ${dispatcher.office.state}`}
                    />

                    <InfoDispatcherRow
                        icon={<Phone size={24} strokeWidth={2} />}
                        label="Contato Direto"
                        value={dispatcher.office.contact}
                    />

                    <InfoDispatcherRow
                        icon={<Mail size={24} strokeWidth={2} />}
                        label="E-mail"
                        value={dispatcher.user.email}
                    />
                </div>

                {canReview && (
                    <>
                        <Separator className="my-6 md:my-8" />

                        {/* =========================
                            SEÇÃO DE AVALIAÇÃO
                            ========================= */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
                                Avalie o Atendimento
                            </p>

                            {/* Rating visual (interativo no futuro) */}
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={22}
                                        onClick={onOpenReview}
                                        className="text-zinc-200 hover:text-yellow-400 cursor-pointer transition-colors"
                                    />
                                ))}
                            </div>

                            {/* Ação de envio de feedback */}
                            <Button
                                onClick={onOpenReview}
                                className="cursor-pointer w-full h-12 bg-[#21314D] hover:bg-[#1A263D] text-xs font-bold h-11 rounded-2xl shadow-md transition-all active:scale-95"
                            >
                                Enviar Feedback
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
}

/**
 * Props do componente InfoDispatcherRow.
 * Representa uma linha de informação no perfil do despachante.
 */
type InfoDispatcherRowProps = {
    /** Ícone representativo da informação */
    icon: React.ReactNode;
    /** Label descritivo (ex: "Contato", "E-mail") */
    label: string;
    /** Valor principal exibido */
    value: string;
    /** Informação complementar opcional */
    subValue?: string;
}

/**
 * Componente auxiliar para exibição de informações do despachante.
 */
function InfoDispatcherRow({ icon, label, value, subValue }: InfoDispatcherRowProps) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-all duration-200 group border border-transparent hover:border-zinc-100">

            {/* CONTAINER DO ÍCONE: âncora visual */}
            <div className="flex-shrink-0 w-14 h-14 bg-zinc-50 rounded-xl flex items-center justify-center text-[#21314D]/70 group-hover:bg-white group-hover:text-[#21314D] group-hover:shadow-sm transition-all">
                {icon}
            </div>

            {/* BLOCO DE TEXTO */}
            <div className="flex flex-col">

                {/* Label */}
                <span className="text-[11px] md:text-xs font-bold text-zinc-400 uppercase tracking-[0.12em] leading-none mb-1">
                    {label}
                </span>

                {/* Valor principal */}
                <span className="text-sm md:text-[15px] font-bold text-[#1E1E1E] leading-tight">
                    {value}
                </span>

                {/* Valor secundário opcional */}
                {subValue && (
                    <span className="text-sm font-medium text-zinc-500 mt-0.5">
                        {subValue}
                    </span>
                )}
            </div>
        </div>
    );
}
