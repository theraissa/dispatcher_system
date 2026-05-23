import { Skeleton } from "@/components/ui/skeleton";
import { useDispatcherReviews } from "@/hooks/dispatcher/use-dispatcher-reviews";
import { formatDate } from "@/utils/formatters";
import { Star } from "lucide-react";

export function AsideReviewsDispatcher({ dispatcherId }: { dispatcherId: number }) {
    const { reviews, loadingReviews } = useDispatcherReviews(dispatcherId);

    if (loadingReviews) return <ReviewAsideSkeleton />;

    if (!reviews || reviews.length === 0) return null;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header fixo das avaliações */}
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs md:text-sm font-black text-[#1E1E1E] uppercase tracking-widest">
                    Avaliações
                </h3>
                <span className="text-xs md:text-sm font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">
                    {reviews.length} total
                </span>
            </div>

            {/* Container com Scroll */}
            <div
                className="space-y-3 max-h-[500px] overflow-y-auto pr-2 
                           scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent 
                           hover:scrollbar-thumb-zinc-300 transition-colors"
            >
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white p-5 rounded-[24px] border border-zinc-100 shadow-sm hover:border-zinc-200 transition-all mb-3 last:mb-0"
                    >
                        <div className="flex gap-0.5 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={10}
                                    fill={i < review.rating ? "#FFB800" : "none"}
                                    className={i < review.rating ? "text-[#FFB800]" : "text-zinc-200"}
                                />
                            ))}
                        </div>

                        <p className="text-sm md:text-[15px] text-zinc-600 font-medium leading-relaxed italic mb-4">
                            {review.comment}
                        </p>

                        <div className="flex items-center gap-3 pt-3 border-t border-zinc-50">
                            <div className="w-8 h-8 bg-[#21314D] text-white rounded-full flex items-center justify-center font-black text-[10px] md:text-xs">
                                {review.name_user.charAt(0)}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] md:text-xs font-extrabold text-[#1E1E1E] uppercase truncate">
                                    {review.name_user}
                                </span>
                                <span className="text-[10px] md:text-xs text-zinc-400 font-bold">
                                    {formatDate(review.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Indicador visual de que há mais conteúdo (opcional) */}
            {reviews.length > 3 && (
                <p className="text-xs md:text-sm text-center text-zinc-400 font-bold uppercase tracking-tighter">
                    Role para ver mais
                </p>
            )}
        </div>
    );
}
function ReviewAsideSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <Skeleton className="h-4 w-24 ml-2" />
            {[1, 2].map((i) => (
                <div key={i} className="bg-white p-5 rounded-[24px] border border-zinc-100 space-y-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-10 w-full" />
                    <div className="flex gap-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-2 w-12" />
                            <Skeleton className="h-2 w-8" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
