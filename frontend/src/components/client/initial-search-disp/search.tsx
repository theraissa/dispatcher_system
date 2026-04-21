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

      {/* Container principal da barra de busca */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm border border-zinc-100">

        {/* Campo de input */}
        <div className="relative flex-1 group">

          {/* Ícone dentro do input */}
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D]"
            size={18}
          />

          {/* Input controlado */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)} // Atualiza estado no componente pai
            placeholder="Buscar por nome, serviço ou cidade..."
            className="w-full h-12 pl-12 pr-4 bg-transparent outline-none text-sm font-medium placeholder:text-zinc-400"
          />
        </div>

        {/* Botão de busca */}
        <button
          onClick={onSearch} // Dispara busca definida pelo componente pai
          className="cursor-pointer px-8 h-12 bg-[#21314D] text-white rounded-full font-bold text-sm hover:bg-[#1A263D] transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <SearchIcon size={16} />
          Buscar
        </button>
      </div>
    </div>
  );
}
