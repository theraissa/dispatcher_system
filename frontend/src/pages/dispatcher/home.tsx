import { HomeBannerDispatcher } from "@/components/dispatcher/home/banner";
import { HomeReviewDispatcher } from "@/components/dispatcher/home/review";
import { HomeStaticsDispatcher } from "@/components/dispatcher/home/statistics";
import NavbarPage from "@/components/record/ui/navbar-page";
import { useAuthRequired } from "@/hooks/auth/auth-requirered";
import { dispatcherLinksNavbar } from "@/routes/frontend-routes";


/**
 * Página inicial do painel do despachante.
 */
export default function HomeDispatcher() {

    // Obtém o usuário autenticado
    const { user } = useAuthRequired();

    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            {/* Navbar principal do painel */}
            <NavbarPage
                title="Central do Despachante"
                shortTitle="D"
                links={dispatcherLinksNavbar}
            />

            <main className="max-w-[1400px] mx-auto py-10 px-6 space-y-12">

                {/* Banner de boas-vindas / destaque */}
                <HomeBannerDispatcher />

                {/* KPIs e métricas do despachante */}
                <HomeStaticsDispatcher userId={user.id} />

                {/* Avaliações recebidas dos clientes */}
                <HomeReviewDispatcher userId={user.id} />
            </main>
        </div>
    );
}
