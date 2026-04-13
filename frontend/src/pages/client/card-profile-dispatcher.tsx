import { useParams } from "react-router-dom";
import { useDispatcherProfile } from "@/hooks/use-dispatcher-profile";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { AsideProfileDispatcher } from "@/components/client/card-profile-dispatcher/aside-profile";
import NavbarPage from "@/components/record/ui/navbar-page";
import AccordionServiceDispatcher from "@/components/client/card-profile-dispatcher/accordion-service";
import { useAuth } from "@/hooks/use-auth";


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

    const { user } = useAuth();
    const { data, loading } = useDispatcherProfile(user.id, dispatcherId!);

    if (loading) {
        return <p className="text-center mt-10">Carregando perfil...</p>;
    }
    if (!data) {
        return <p className="text-center mt-10">Despachante não encontrado.</p>;
    }

    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            <NavbarPage
                title="Central do Cliente"
                shortTitle="C"
                links={clientLinksNavbar}
            />
            <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
                <header className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E1E1E] tracking-tight">
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
                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">

                    {/* ASIDE: Informações do despachante */}
                    <AsideProfileDispatcher dispatcher={data} />

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
