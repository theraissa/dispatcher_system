import { useDispatcherReviews } from "@/hooks/use-dispatcher-reviews";
import { Star } from "lucide-react";
import { formatDate } from "@/utils/formatters";


/**
 * Componente responsável por exibir as avaliações recebidas pelo despachante na página inicial.
 *
 * Responsabilidades:
 * - Buscar e exibir reviews de clientes associados ao despachante
 * - Apresentar estado de carregamento (skeleton) enquanto os dados são buscados
 * - Tratar estado vazio (quando não há avaliações)
 * - Renderizar avaliações com nota, comentário e informações do usuário
 * 
 * @param userId - Identificador do despachante logado
 * @returns Seção de avaliações dos clientes
 */
export function HomeReviewDispatcher({ userId }: { userId: number }) {
    const { reviews, loadingReviews, summary, loadingSummary } = useDispatcherReviews(userId);

    // Média vinda do seu serviço
    const averageRating = summary?.average_rating;

    return (
        <section className="max-w-6xl mx-auto py-10 space-y-12">
            <div className="text-center space-y-4">
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black text-[#1E1E1E] uppercase tracking-tighter">
                        O que dizem os <span className="text-[#21314D]">Clientes</span>
                    </h2>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">
                        Sua reputação em destaque
                    </p>
                </div>

                {/* BADGE DE MÉDIA VINDO DO SUMMARY */}
                {!loadingSummary && averageRating !== undefined && (
                    <div className="flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-500">
                        <div className="h-px w-8 bg-zinc-200 hidden sm:block" />
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100">
                            <Star size={16} fill="#FFB800" className="text-[#FFB800]" />
                            <span className="text-lg font-black text-[#1E1E1E]">
                                {Number(averageRating).toFixed(1)}
                            </span>
                            <div className="flex flex-col items-start border-l border-zinc-100 pl-3 ml-1">
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                                    Média Geral
                                </span>
                            </div>
                        </div>
                        <div className="h-px w-8 bg-zinc-200 hidden sm:block" />
                    </div>
                )}
            </div>

            {loadingReviews ? (
                <ReviewSkeleton />
            ) : !reviews || reviews.length === 0 ? (
                <div className="bg-white/50 p-12 rounded-[32px] border border-dashed border-zinc-200 text-center">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
                        Nenhuma avaliação foi feita até o momento.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white p-7 rounded-[32px] shadow-sm border border-zinc-100 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-zinc-200"
                        >
                            <div className="space-y-4">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < review.rating ? "#FFB800" : "none"}
                                            className={i < review.rating ? "text-[#FFB800]" : "text-zinc-200"}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-zinc-600 font-medium leading-relaxed italic">
                                    "{review.comment || "Sem comentário"}"
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-50">
                                <div className="w-10 h-10 bg-[#21314D]/5 rounded-full flex items-center justify-center text-[#21314D] font-black text-xs shrink-0">
                                    {review.name_user.charAt(0) || "?"}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-extrabold text-[#1E1E1E] text-xs truncate uppercase tracking-tight">
                                        {review.name_user || "Usuário"}
                                    </p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                        {formatDate(review.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
function ReviewSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
                <div
                    key={n}
                    className="bg-white/50 p-7 rounded-[32px] border border-zinc-100 flex flex-col justify-between h-[220px]"
                >
                    <div className="space-y-4">
                        {/* Skeleton das Estrelas */}
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-3.5 h-3.5 bg-zinc-200 rounded-full" />
                            ))}
                        </div>

                        {/* Skeleton do Comentário */}
                        <div className="space-y-2">
                            <div className="h-3 bg-zinc-200 rounded w-full" />
                            <div className="h-3 bg-zinc-200 rounded w-[80%]" />
                        </div>
                    </div>

                    {/* Skeleton do Rodapé */}
                    <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-50">
                        <div className="w-10 h-10 bg-zinc-200 rounded-full shrink-0" />
                        <div className="space-y-2 w-full">
                            <div className="h-3 bg-zinc-200 rounded w-20" />
                            <div className="h-2 bg-zinc-100 rounded w-12" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
