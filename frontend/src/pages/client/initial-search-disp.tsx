import { useSearchDispatchers } from "@/hooks/dispatcher/use-search-dispatcher";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // 1. IMPORTANTE: Importamos o hook de parâmetros da URL
import CardDispatcher from "../../components/client/initial-search-disp/card";
import Search from "../../components/client/initial-search-disp/search";
import NavbarPage from "../../components/record/ui/navbar-page";


export default function InitialSearchDisp() {
  // 2. Substituímos o useState da query pelo gerenciador de parâmetros da URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Pegamos o termo 'search' direto da URL (se existir). Ex: ?search=pedro
  const urlQuery = searchParams.get("search") || "";

  // O input de texto começa preenchido com o que estiver na URL (caso o usuário esteja voltando)
  const [input, setInput] = useState(urlQuery);

  // Passamos a query da URL direto para o seu hook de busca do backend
  const { data, loading } = useSearchDispatchers(urlQuery);

  /**
   * 3. Sincroniza o input caso a URL mude externamente 
   * e garante que o input não fique em branco ao clicar em "Voltar"
   */
  useEffect(() => {
    setInput(urlQuery);
  }, [urlQuery]);

  /**
   * Executa a busca ao clicar no botão.
   * Em vez de salvar em um estado local, salvamos na URL do navegador.
   */
  const handleSearch = () => {
    if (input.trim()) {
      setSearchParams({ search: input });
    } else {
      setSearchParams({});
    }
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
          hasSearched={!!urlQuery}
          searchTerm={urlQuery}
        />
      </main>
    </div>
  );
}
