import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useDispatcherReviews } from "@/hooks/dispatcher/use-dispatcher-reviews";
import { formatDate } from "@/utils/formatters";
import { MessageSquareQuote, Star } from "lucide-react";

/**
 * HomeReviewDispatcher
 * 
 * Componente responsável por exibir o feedback dos clientes no dashboard do despachante.
 * Utiliza um carrossel responsivo para listar as avaliações, permitindo a visualização
 * de múltiplos depoimentos sem comprometer o scroll vertical da página.
 * 
 * Funcionalidades:
 * - Busca reviews e sumário (média) via hook customizado.
 * - Exibe badge de média geral com animação.
 * - Carrossel adaptável (1 card mobile, 2 tablet, 3 desktop, 4 ultra-wide).
 * - Tratamento de estados: Loading (Skeleton) e Empty State.
 */
export function HomeReviewDispatcher({ userId }: { userId: number }) {
    const { reviews, loadingReviews, summary, loadingSummary } = useDispatcherReviews(userId);

    const averageRating = summary?.average_rating;

    return (
        <section className="max-w-7xl mx-auto py-6 md:py-10 space-y-8 md:space-y-12">

            {/* CABEÇALHO DA SEÇÃO: Título e Média Geral */}
            <div className="text-center space-y-4">
                <div className="space-y-2">
                    <h2 className="text-xl md:text-3xl font-black text-[#1E1E1E] uppercase tracking-tighter">
                        O que dizem os <span className="text-[#21314D]">Clientes</span>
                    </h2>
                    <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
                        Sua reputação em destaque
                    </p>
                </div>

                {/* Badge de Nota Média: Exibido apenas quando os dados estão prontos */}
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

            {/* ÁREA DE CONTEÚDO: Carrossel, Skeleton ou Estado Vazio */}
            {loadingReviews ? (
                <ReviewSkeleton />
            ) : !reviews || reviews.length === 0 ? (
                /* Estado Vazio: Quando o despachante ainda não possui avaliações */
                <div className="bg-white/50 p-8 md:p-12 rounded-[32px] border border-dashed border-zinc-200 text-center mx-4">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                        Nenhuma avaliação foi feita até o momento.
                    </p>
                </div>
            ) : (
                <div className="px-6 md:px-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true, // Permite navegação contínua
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {reviews.map((review) => (
                                <CarouselItem
                                    key={review.id}
                                    /* 
                                       Responsividade do Item:
                                       - Default: 85% largura (mostra um pedaço do próximo no mobile)
                                       - md: 50% (2 itens)
                                       - lg: 33% (3 itens)
                                       - xl: 25% (4 itens)
                                    */
                                    className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                >
                                    <div className="bg-white p-6 md:p-7 rounded-[24px] md:rounded-[32px] shadow-sm border border-zinc-100 flex flex-col justify-between h-full min-h-[220px] md:min-h-[250px] transition-all duration-300 hover:shadow-md hover:border-zinc-200">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                {/* Estrelas da Avaliação Individual */}
                                                <div className="flex gap-0.5 md:gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            fill={i < review.rating ? "#FFB800" : "none"}
                                                            className={i < review.rating ? "text-[#FFB800]" : "text-zinc-200"}
                                                        />
                                                    ))}
                                                </div>
                                                <MessageSquareQuote size={16} className="text-zinc-100 md:size-[18px]" />
                                            </div>

                                            {/* Comentário: Limitado a 4 linhas para manter consistência visual */}
                                            <p className="text-xs md:text-sm text-zinc-600 font-medium leading-relaxed italic line-clamp-4">
                                                {review.comment}
                                            </p>
                                        </div>

                                        {/* Rodapé do Card: Dados do Cliente */}
                                        <div className="flex items-center gap-3 pt-4 md:pt-6 mt-4 md:mt-6 border-t border-zinc-50">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#21314D]/5 rounded-full flex items-center justify-center text-[#21314D] font-black text-[10px] md:text-xs shrink-0">
                                                {review.user_name.charAt(0) || "?"}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-extrabold text-[#1E1E1E] text-[10px] md:text-xs truncate uppercase tracking-tight">
                                                    {review.user_name || "Usuário"}
                                                </p>
                                                <p className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                                    {formatDate(review.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Controles do Carrossel: Escondidos em telas muito pequenas */}
                        <div className="hidden lg:block">
                            <CarouselPrevious className="-left-6 h-10 w-10 border-zinc-200 text-zinc-400 hover:text-[#21314D] hover:border-[#21314D]" />
                            <CarouselNext className="-right-6 h-10 w-10 border-zinc-200 text-zinc-400 hover:text-[#21314D] hover:border-[#21314D]" />
                        </div>
                    </Carousel>
                </div>
            )}
        </section>
    );
}

function ReviewSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse px-6 md:px-12">
            {[1, 2, 3, 4].map((n) => (
                <div
                    key={n}
                    className="bg-white/50 p-6 md:p-7 rounded-[24px] md:rounded-[32px] border border-zinc-100 flex flex-col justify-between h-[220px] md:h-[250px]"
                >
                    <div className="space-y-4">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-3 h-3 bg-zinc-200 rounded-full" />
                            ))}
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-zinc-200 rounded w-full" />
                            <div className="h-3 bg-zinc-200 rounded w-[80%]" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-50">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-200 rounded-full shrink-0" />
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
