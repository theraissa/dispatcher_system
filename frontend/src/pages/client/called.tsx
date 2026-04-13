import NavbarPage from "../../components/record/ui/navbar-page";
import CalledClientFilter from "@/components/client/called/called-client-filter";
import CalledContainer from "@/components/client/called/called-container";
import { useAuth } from "@/hooks/use-auth";
import { useTickets } from "@/hooks/use-ticket";
import { clientLinksNavbar } from "@/routes/frontend-routes";


export default function CalledClient() {

    const { user } = useAuth();
    const { tickets, loading } = useTickets(user?.id);

    if (loading) {
        return <div>Carregando chamados...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            <NavbarPage title="Central do Cliente" shortTitle="C" links={clientLinksNavbar} />

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
                <CalledContainer tickets={tickets} />
            </main>
        </div>
    );
}
