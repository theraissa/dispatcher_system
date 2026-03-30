import { useState } from "react";
import NavbarPage from "../../components/record/ui/navbar-page"
import Search from "../../components/client/initial-search-disp/search"
import CardDispatcher from "../../components/client/initial-search-disp/card"
import { useSearchDispatchers } from "@/hooks/use-search-dispatcher";
import { clientLinksNavbar } from "@/routes/frontend-routes";

export default function InitialSearchDisp() {
  const [filters, setFilters] = useState({
    name: "",
    service: "",
    city: "",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const { data, loading } = useSearchDispatchers(appliedFilters);

  const handleSearch = () => {
    setAppliedFilters(filters);
  };


  return (
    <div className="min-h-screen bg-[#F3EDE2]">
      <NavbarPage title="Central do Cliente" shortTitle="C" links={clientLinksNavbar} />

      <main className="py-12">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1E1E] tracking-tight">
            Encontre o seu <span className="text-[#21314D]">Despachante</span>
          </h2>
          <p className="text-zinc-500 text-sm font-medium">
            Conectando você aos melhores profissionais da sua região.
          </p>
        </div>

        <Search
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
        />
        <CardDispatcher dispatchers={data} loading={loading} />
      </main>
    </div>
  );
}
