import { Search as SearchIcon, MapPin, Briefcase } from "lucide-react";


export default function Search() {
  const inputContainerStyles = "relative flex-1 w-full group";
  const iconStyles = "absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors";
  const inputStyles = "w-full h-12 pl-12 pr-4 bg-transparent outline-none text-sm font-medium placeholder:text-zinc-400";
  const dividerStyles = "hidden lg:block w-px h-8 bg-zinc-200";

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 px-4">
      <div className="flex flex-col lg:flex-row items-center gap-3 bg-white p-2 rounded-[24px] lg:rounded-full shadow-sm border border-zinc-100">

        {/* 1. Busca por Nome/Despachante */}
        <div className={inputContainerStyles}>
          <SearchIcon className={iconStyles} size={18} />
          <input
            type="text"
            placeholder="Nome do despachante..."
            className={inputStyles}
          />
        </div>

        <div className={dividerStyles} />

        {/* 2. NOVO: Busca por Serviço */}
        <div className={inputContainerStyles}>
          <Briefcase className={iconStyles} size={18} />
          <input
            type="text"
            placeholder="Qual serviço procura? (ex: IPVA)"
            className={inputStyles}
          />
        </div>

        <div className={dividerStyles} />

        {/* 3. Busca por Município */}
        <div className={inputContainerStyles}>
          <MapPin className={iconStyles} size={18} />
          <input
            type="text"
            placeholder="Cidade ou região..."
            className={inputStyles}
          />
        </div>

        {/* Botão de Ação */}
        <button className="w-full lg:w-auto px-10 h-12 bg-[#21314D] text-white rounded-xl lg:rounded-full font-bold text-sm hover:bg-[#1A263D] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
          <SearchIcon size={16} className="lg:hidden" />
          Buscar
        </button>
      </div>
    </div>
  );
}
