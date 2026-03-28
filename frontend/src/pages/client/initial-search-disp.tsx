import NavbarPage from "../../components/record/ui/navbar-page"
import Search from "../../components/client/initial-search-disp/search"
import CardDispatcher from "../../components/client/initial-search-disp/card"

export default function InitialSearchDisp() {
  return (
    <div className="min-h-screen bg-[#F3EDE2]">
      <NavbarPage />
      <main className="py-12">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1E1E] tracking-tight">
            Encontre o seu <span className="text-[#21314D]">Despachante</span>
          </h2>
          <p className="text-zinc-500 text-sm font-medium">
            Conectando você aos melhores profissionais da sua região.
          </p>
        </div>

        <Search />
        <CardDispatcher />
      </main>
    </div>
  )
}
