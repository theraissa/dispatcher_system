import { Search as SearchIcon } from "lucide-react";

/**
 * Props esperadas pelo componente de busca.
 */
type SearchProps = {
  // Valor atual do input (controlado pelo componente pai)
  input: string;

  // Função para atualizar o valor do input
  setInput: (value: string) => void;

  // Função disparada ao clicar no botão de busca
  onSearch: () => void;
};

/**
 * Componente de busca de despachantes.
 *
 * Responsabilidades:
 * - Controlar input de busca (via props controladas)
 * - Permitir que o usuário digite termos (nome, serviço ou cidade)
 * - Disparar a ação de busca ao clicar no botão
 *
 * Observação:
 * Este componente é "controlado", ou seja:
 * - O estado do input não fica aqui
 * - Ele vem do componente pai (via props)
 *
 * @returns Barra de busca estilizada com input e botão
 */
export default function Search({ input, setInput, onSearch }: SearchProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12 px-4">
      <div className="flex items-center gap-2 bg-white p-1.5 sm:p-2 rounded-full shadow-sm border border-zinc-100">

        <div className="relative flex-1 group">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D]"
            size={18}
          />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearch();
              }
            }}
            placeholder="Nome, serviço ou cidade..."
            className="w-full h-10 sm:h-12 pl-11 sm:pl-12 pr-2 bg-transparent outline-none text-sm font-medium placeholder:text-zinc-400"
          />
        </div>

        <button
          type="button"
          onClick={onSearch}
          className="cursor-pointer h-10 w-10 sm:h-12 sm:w-auto sm:px-8 bg-[#21314D] text-white rounded-full font-bold text-sm hover:bg-[#1A263D] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 flex-shrink-0"
        >
          <SearchIcon size={18} />
          <span className="hidden sm:block">Buscar</span>
        </button>
      </div>
    </div>
  );
}
