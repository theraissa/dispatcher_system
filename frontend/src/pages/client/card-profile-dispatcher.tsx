import AccordionServiceDispatcher from "@/components/client/card-profile-dispatcher/accordion-service";
import { AsideProfileDispatcher } from "@/components/client/card-profile-dispatcher/aside-profile";
import { AsideReviewsDispatcher } from "@/components/client/card-profile-dispatcher/aside-reviews-dispatcher";
import { FeedbackState } from "@/components/record/ui/feedback-state";
import NavbarPage from "@/components/record/ui/navbar-page";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthRequired } from "@/hooks/auth/auth-requirered";
import { useDispatcherProfile } from "@/hooks/dispatcher/use-dispatcher-profile";
import { useDispatcherReviews } from "@/hooks/dispatcher/use-dispatcher-reviews";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { useParams } from "react-router-dom";

/**
 * Página responsável por exibir o perfil detalhado de um despachante.
 *
 * Essa página atua como ponto central de interação entre o cliente e o profissional,
 * permitindo:
 * - Visualizar informações completas do despachante
 * - Explorar serviços disponíveis
 * - Iniciar fluxo de contratação (via accordion de serviços)
 */
export default function CardProfileDispatcher() {

    const { userId } = useParams();
    const dispatcherId = Number(userId);

    const { user } = useAuthRequired();
    const { data, loading } = useDispatcherProfile(user.id, dispatcherId!);
    const { reviews, summary } = useDispatcherReviews(dispatcherId);

    if (loading) {
        return <CardProfileSkeleton />;
    }

    if (!data) {
        return (
            <FeedbackState
                title="Despachante não encontrado"
                description="Não conseguimos localizar o perfil deste profissional. Ele pode estar desativado."
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            <NavbarPage links={clientLinksNavbar} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 md:pt-10 pb-20">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-[#1E1E1E] tracking-tight">
                        Perfil do <span className="text-[#21314D]">Profissional</span>
                    </h1>

                    <p className="text-zinc-500 text-sm md:text-base font-medium mt-2 max-w-2xl">
                        Confira as especialidades de{" "}
                        <span className="font-bold text-[#1E1E1E]">
                            {data.user.name}
                        </span>{" "}
                        e inicie seu atendimento de forma rápida e segura.
                    </p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 md:gap-8">

                    <aside className="space-y-8">
                        {/* ASIDE: Informações do despachante */}
                        <AsideProfileDispatcher
                            dispatcher={data}
                            rating={summary?.average_rating} // Passando a média
                            totalReviews={reviews?.length}   // Passando total
                            onOpenReview={() => console.log("Abrir modal")}
                        />
                        {/*ASIDE: Reviews do despachante*/}
                        <AsideReviewsDispatcher dispatcherId={dispatcherId} />
                    </aside>

                    {/* CONTEÚDO: Serviços disponíveis */}
                    <AccordionServiceDispatcher
                        userId={user.id}
                        dispatcherId={dispatcherId}
                    />
                </div>
            </main>
        </div>
    );
}
/**
 * SKELETON
 */
export function CardProfileSkeleton() {
    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            {/* Navbar Placeholder (sem animação para não distrair) */}
            <div className="w-full h-[60px] bg-[#21314D]" />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 md:pt-10 pb-20">
                <header className="mb-8 md:mb-12">
                    <Skeleton className="h-10 w-64 md:w-80 mb-4" />
                    <Skeleton className="h-4 w-full max-w-md" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 md:gap-8">
                    {/* ASIDE SKELETON */}
                    <aside className="w-full">
                        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-zinc-100 border-t-[6px] border-t-zinc-200">
                            <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-[24px] mx-auto mb-6" />

                            <div className="flex flex-col items-center gap-3 mb-8">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-3 w-32" />
                            </div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 border border-transparent">
                                        <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* CONTENT SKELETON */}
                    <section className="bg-white p-8 md:p-10 rounded-[32px] border border-zinc-100 h-fit">
                        <div className="mb-10 space-y-3">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
