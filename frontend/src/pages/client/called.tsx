import NavbarPage from "../../components/record/ui/navbar-page";
import CalledClientFilter from "@/components/client/called/called-client-filter";
import CalledContainer from "@/components/client/called/called-container";
import { clientLinksNavbar } from "@/routes/frontend-routes";


export default function CalledClient() {

    const tickets = [
        { id: "0001", service: "Transferência de Veículo", dispatcher: "Carlos Silva", date: "28/03/2026", state: "RS", status: "Em Andamento" },
        { id: "0002", service: "Licenciamento Anual", dispatcher: "Ana Oliveira", date: "25/03/2026", state: "SC", status: "Concluído" },
    ];

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
