import NavbarPage from "../../components/record/ui/navbar-page";
import CalledClientFilter from "@/components/called/called-filter";
import CalledContainer from "@/components/called/called-container";
import { useAuth } from "@/hooks/use-auth";
import { useTickets } from "@/hooks/use-ticket";
import { dispatcherLinksNavbar, FRONTEND_ROUTES } from "@/routes/frontend-routes";


export default function CalledDispatcher() {

    const { user } = useAuth();
    const { tickets, loading } = useTickets(user?.id);

    if (loading) {
        return <div>Carregando chamados...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            {/* Navbar */}
            <NavbarPage
                title="Central do Despachante"
                shortTitle="D"
                links={dispatcherLinksNavbar}
            />
            <main className="max-w-6xl mx-auto py-10 px-6">

                {/* TÍTULO E RESUMO */}
                <header className="mb-10 text-center lg:text-left">
                    <h1 className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
                        Seus <span className="text-[#21314D]">Chamados</span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Acompanhe em tempo real o status das suas solicitações.</p>
                </header>

                {/* BARRA DE FILTROS (Refatorada para ser mais compacta) */}
                <CalledClientFilter />

                {/* CONTAINER DOS CHAMADOS */}
                <CalledContainer
                    tickets={tickets}
                    detailsRoute={FRONTEND_ROUTES.DISPATCHER.CALLED_DETAILS}
                />
            </main>
        </div>
    );
}
