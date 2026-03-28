import { useState } from "react";
import { Search, ArrowLeft, CheckCircle2, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileCard, ProfileContainer } from "./layout/profile-card";


type Service = {
  id: number;
  name: string;
};

type Props = {
  availableServices: Service[];
  onAdd: (services: Service[]) => void;
  onCancel: () => void;
};

export default function SelectServices({ availableServices, onAdd, onCancel }: Props) {
  const [search, setSearch] = useState("");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  function toggleService(service: Service) {
    setSelectedServices(prev =>
      prev.some(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    );
  }

  const filteredServices = availableServices.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProfileContainer>
      <ProfileCard>
        {/* Cabeçalho */}
        <div className="space-y-1 mb-2">
          <h3 className="text-xl font-extrabold text-[#1E1E1E] tracking-tight">
            Adicionar <span className="text-[#21314D]">Novos Serviços</span>
          </h3>
          <p className="text-zinc-500 text-sm">Selecione os serviços que deseja oferecer em seu perfil.</p>
        </div>

        {/* Busca com o novo padrão enxuto */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Pesquisar serviços disponíveis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-zinc-100 border-none rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#21314D]/10 outline-none transition-all"
          />
        </div>

        {/* Lista de Seleção */}
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredServices.map(service => {
            const isSelected = selectedServices.some(s => s.id === service.id);

            return (
              <button
                key={service.id}
                onClick={() => toggleService(service)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                  isSelected
                    ? "bg-[#21314D]/5 border-[#21314D] shadow-sm"
                    : "bg-white border-zinc-100 hover:border-zinc-300"
                )}
              >
                <span className={cn(
                  "text-sm font-bold transition-colors",
                  isSelected ? "text-[#21314D]" : "text-[#333]"
                )}>
                  {service.name}
                </span>

                {isSelected ? (
                  <CheckCircle2 className="text-[#21314D]" size={20} />
                ) : (
                  <PlusCircle className="text-zinc-300" size={20} />
                )}
              </button>
            );
          })}

          {filteredServices.length === 0 && (
            <div className="py-10 text-center bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
              <p className="text-zinc-400 text-sm">Nenhum serviço disponível.</p>
            </div>
          )}
        </div>

        {/* Footer Alinhado */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-zinc-500 font-bold text-sm hover:text-[#1E1E1E] transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <button
            disabled={selectedServices.length === 0}
            onClick={() => onAdd(selectedServices)}
            className={cn(
              "flex items-center gap-2 px-8 py-3 bg-[#21314D] text-white rounded-xl font-bold text-sm transition-all",
              "hover:bg-[#1A263D] active:scale-95 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed shadow-sm"
            )}
          >
            Adicionar Selecionados {selectedServices.length > 0 && `(${selectedServices.length})`}
          </button>
        </div>
      </ProfileCard>
    </ProfileContainer>
  );
}
