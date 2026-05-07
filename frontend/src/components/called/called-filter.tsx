import { cn } from "@/lib/utils";
import type { TicketFilters } from "@/types/ticket.types";
import { Hash, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useState } from "react";


/**
 * Props do componente CalledClientFilter
 */
type CalledClientFilterProps = {
    onSearch: (filters: TicketFilters) => void;
};


/**
 * Componente responsável por coletar e emitir filtros de busca de chamados.
 *
 * Responsabilidades:
 * - Controlar os valores dos campos de filtro (texto, ID e data)
 * - Permitir exibição opcional de filtros avançados
 * - Emitir os filtros para o componente pai através do callback `onSearch`
 *
 * @param onSearch - Função chamada ao executar a busca com os filtros definidos
 */
export default function CalledClientFilter({ onSearch }: CalledClientFilterProps) {

    // Controla a visibilidade dos filtros avançados
    const [showFilters, setShowFilters] = useState(false);

    // Estado que armazena os valores dos filtros
    const [filters, setFilters] = useState<TicketFilters>({
        search: "",
        id: "",
        date: "",
        state: "",
    });

    /**
     * Atualiza dinamicamente um campo específico do filtro.
     *
     * @param key - Nome do campo do filtro (search, id, date, state)
     * @param value - Novo valor do campo
     */
    function handleChange<K extends keyof TicketFilters>(key: K, value: TicketFilters[K]) {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    return (
        <div className="w-full max-w-10xl mx-auto mb-8 space-y-3">

            {/* Barra Principal */}
            <div className="flex items-center gap-2 bg-white p-1.5 sm:p-2 rounded-full shadow-sm border border-zinc-100 transition-all focus-within:border-[#21314D]/30">

                {/* Input: Placeholder menor no mobile para não empurrar os botões */}
                <div className="relative flex-1 group">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar serviço..."
                        className="w-full h-10 sm:h-12 pl-11 pr-2 bg-transparent outline-none text-sm font-medium placeholder:text-zinc-400"
                        value={filters.search}
                        onChange={(e) => handleChange("search", e.target.value)}
                    />
                </div>

                {/* Botão Filtros: Texto some no mobile */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "cursor-pointer flex items-center justify-center gap-2 h-10 w-10 sm:w-auto sm:px-4 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shrink-0",
                        showFilters ? "bg-zinc-100 text-[#21314D]" : "text-zinc-400 hover:bg-zinc-50"
                    )}
                >
                    <SlidersHorizontal size={18} />
                    <span className="hidden md:inline">Filtros</span>
                </button>

                {/* Botão Buscar: Vira ícone no mobile */}
                <button
                    onClick={() => onSearch(filters)}
                    className="cursor-pointer h-10 w-10 sm:h-12 sm:w-auto sm:px-8 bg-[#21314D] text-white rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0"
                >
                    <SearchIcon size={18} />
                    <span className="hidden sm:inline">Buscar</span>
                </button>
            </div>

            {/* =========================
                FILTROS AVANÇADOS
               ========================= */}
            <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden transition-all",
                showFilters ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0 pointer-events-none"
            )}>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="ID do Chamado"
                        className="w-full h-11 pl-4 pr-10 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:border-[#21314D] outline-none"
                        value={filters.id}
                        onChange={(e) => handleChange("id", e.target.value)}
                    />
                    <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                </div>

                {/* Filtro por data */}
                <div className="relative group">
                    <input
                        type="date"
                        className="w-full h-11 px-4 bg-white border border-zinc-200 rounded-2xl text-sm focus:border-[#21314D] outline-none"
                        value={filters.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
}
