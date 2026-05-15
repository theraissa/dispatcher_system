import { cn } from "@/lib/utils";
import type { Service } from "@/types/type";
import { ArrowLeft, CheckCircle2, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { ProfileCard, ProfileContainer } from "./layout/profile-card";


/**
 * Props do componente SelectServices.
 */
type SelectServicesProps = {
  // Lista de serviços disponíveis para seleção.
  availableServices: Service[];
  // Callback executado ao confirmar a seleção.
  onAdd: (services: Service[]) => void;
  // Callback executado ao cancelar a operação.
  onCancel: () => void;
};


/**
 * Componente responsável pela seleção de novos serviços.
 *
 * Permite:
 * - Buscar serviços disponíveis
 * - Selecionar múltiplos serviços
 * - Confirmar adição ao perfil
 * - Cancelar operação
 */
export default function SelectServices({
  availableServices, onAdd, onCancel,
}: SelectServicesProps) {

  //Texto utilizado para filtrar serviços por nome.
  const [search, setSearch] = useState("");
  // Lista de serviços selecionados pelo usuário.
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  /**
   * Alterna o estado de seleção de um serviço.
   *
   * - Se já estiver selecionado: remove da lista
   * - Se não estiver selecionado: adiciona à lista
   */
  function toggleService(service: Service) {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  }

  /**
   * Lista de serviços filtrados pelo texto de busca.
   * A comparação é feita de forma case-insensitive.
   */
  const filteredServices = availableServices.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProfileContainer>
      <ProfileCard>

        {/* =========================
            CABEÇALHO
           ========================= */}
        <div className="space-y-1 mb-2">
          <h3 className="cursor-pointer text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
            Adicionar <span className="text-[#21314D]">Novos Serviços</span>
          </h3>

          <p className="text-zinc-500 text-base">
            Selecione os serviços que deseja oferecer em seu perfil.
          </p>
        </div>

        {/* =========================
            CAMPO DE BUSCA
           ========================= */}
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors"
            size={20}
          />

          <input
            type="text"
            placeholder="Pesquisar serviços disponíveis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-14 pr-4 bg-zinc-100 border-none rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#21314D]/10 outline-none transition-all"
          />
        </div>

        {/* =========================
            LISTA DE SERVIÇOS
           ========================= */}
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">

          {filteredServices.map((service) => {
            const isSelected = selectedServices.some(
              (s) => s.id === service.id
            );

            return (
              <button
                key={service.id}
                onClick={() => toggleService(service)}
                className={cn(
                  "cursor-pointer flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left",
                  isSelected
                    ? "bg-[#21314D]/5 border-[#21314D] shadow-sm"
                    : "bg-white border-zinc-100 hover:border-zinc-300"
                )}
              >
                {/* Nome do serviço */}
                <span
                  className={cn(
                    "text-[16px] font-bold transition-colors",
                    isSelected ? "text-[#21314D]" : "text-[#333]"
                  )}
                >
                  {service.name}
                </span>

                {/* Ícone de estado (selecionado ou não) */}
                {isSelected ? (
                  <CheckCircle2 className="text-[#21314D]" size={24} />
                ) : (
                  <PlusCircle className="text-zinc-300" size={24} />
                )}
              </button>
            );
          })}

          {/* Estado vazio */}
          {filteredServices.length === 0 && (
            <div className="py-10 text-center bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
              <p className="text-zinc-400 text-sm">
                Nenhum serviço disponível.
              </p>
            </div>
          )}
        </div>

        {/* =========================
            FOOTER (AÇÕES)
           ========================= */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100">

          {/* Ação de cancelamento */}
          <button
            onClick={onCancel}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-zinc-500 font-bold text-sm md:text-[16px] hover:text-[#1E1E1E] transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          {/* Ação de confirmação */}
          <button
            disabled={selectedServices.length === 0}
            onClick={() => onAdd(selectedServices)}
            className={cn(
              "cursor-pointer flex items-center gap-2 px-8 py-2 md:py-3  bg-[#21314D] text-white rounded-xl font-bold text-xs md:text-[16px] transition-all",
              "hover:bg-[#1A263D] active:scale-95 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed shadow-sm"
            )}
          >
            Adicionar Selecionados{" "}
            {selectedServices.length > 0 &&
              `(${selectedServices.length})`}
          </button>
        </div>
      </ProfileCard>
    </ProfileContainer>
  );
}
