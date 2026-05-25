import { useSearchDispatchers } from "@/hooks/dispatcher/use-search-dispatcher";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { useState } from "react";
import CardDispatcher from "../../components/client/initial-search-disp/card";
import Search from "../../components/client/initial-search-disp/search";
import NavbarPage from "../../components/record/ui/navbar-page";

export default function InitialSearchDisp() {

  const [input, setInput] = useState(""); // Estado para o valor do input de busca
  const [query, setQuery] = useState(""); // Estado para a query que será enviada para a API
  const [hasSearched, setHasSearched] = useState(false); // Estado para controlar se o usuário já realizou uma busca

  const { data, loading } = useSearchDispatchers(query);

  const handleSearch = () => {
    setQuery(input);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#F3EDE2]">
      <NavbarPage links={clientLinksNavbar} />

      <main className="py-8 md:py-12 px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-10 space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#1E1E1E] tracking-tight px-2">
            Encontre o seu <span className="text-[#21314D]">Despachante</span>
          </h2>
          <p className="text-zinc-500 text-xs md:text-sm font-medium">
            Conectando você aos melhores profissionais da sua região.
          </p>
        </div>

        <Search
          input={input}
          setInput={setInput}
          onSearch={handleSearch}
        />

        <CardDispatcher
          dispatchers={data}
          loading={loading}
          hasSearched={hasSearched}
        />
      </main>
    </div>
  );
}
