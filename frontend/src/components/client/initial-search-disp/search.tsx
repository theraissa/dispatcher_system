import { Search as SearchIcon } from "lucide-react";

type SearchProps = {
  input: string;
  setInput: (value: string) => void;
  onSearch: () => void;
};

export default function Search({ input, setInput, onSearch }: SearchProps) {

  return (
    <div className="w-full max-w-3xl mx-auto mb-12 px-4">
      <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm border border-zinc-100">

        <div className="relative flex-1 group">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D]"
            size={18}
          />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Buscar por nome, serviço ou cidade..."
            className="w-full h-12 pl-12 pr-4 bg-transparent outline-none text-sm font-medium placeholder:text-zinc-400"
          />
        </div>

        <button
          onClick={onSearch}
          className="px-8 h-12 bg-[#21314D] text-white rounded-full font-bold text-sm hover:bg-[#1A263D] transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <SearchIcon size={16} />
          Buscar
        </button>
      </div>
    </div>
  );
}
