import { Briefcase, Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";

import { useServiceDetails } from "@/hooks/use-service-details";
import { cn } from "@/lib/utils";
import { ProfileCard, ProfileContainer } from "./layout/profile-card";
import ServiceDetails from "./profile-service-details";
import SelectServices from "./select-services";
import ServiceActionButtons from "./ui/profile-buttons-action-service";

/**
 * Componente responsável por gerenciar os serviços do usuário (dispatcher).
 *
 * Ele controla três fluxos principais:
 * - Visualização dos serviços ativos (view)
 * - Seleção de novos serviços (select)
 * - Edição de detalhes de um serviço específico (details)
 */
export default function ProfileServices({ dispatcherId }: { dispatcherId: number }) {

  // Texto usado para filtrar serviços por nome.
  const [search, setSearch] = useState("");

  /**
   * Controla o modo atual da tela:
   * - view: lista de serviços ativos
   * - select: seleção de novos serviços
   * - details: edição de um serviço específico
   */
  const [mode, setMode] = useState<"view" | "select" | "details">("view");

  // Serviço atualmente selecionado para edição/detalhamento.
  const [selectedService, setSelectedService] = useState<any | null>(null);

  // Hook responsável por operações relacionadas aos serviços do dispatcher.
  const {
    serviceDetails,
    allServices,
    loading,
    createServiceDetails,
    updateServiceDetails,
    removeServiceDetails
  } = useServiceDetails(dispatcherId);

  /**
   * Lista de serviços filtrada pelo campo de busca.
   * A comparação é feita de forma case-insensitive.
   */
  const filteredServices = serviceDetails.filter((s) =>
    s.service_name.toLowerCase().includes(search.toLowerCase())
  );

  // Feedback visual de carregamento inicial
  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
      <Loader2 className="animate-spin mb-4" size={32} />
      <span className="font-medium">Carregando seus serviços...</span>
    </div>
  );

  // =========================
  // MODO: SELEÇÃO DE SERVIÇOS
  // =========================
  if (mode === "select") {
    /**
     * Remove serviços já existentes do usuário,
     * evitando duplicação na seleção.
     */
    const availableServices = allServices.filter(
      (s) => !serviceDetails.some(
        (userService) => userService.id === s.id || userService.service_id === s.id
      )
    );

    return (
      <SelectServices
        availableServices={availableServices}
        currentServices={serviceDetails as any[]}
        // Cancela seleção e retorna para lista principal.
        onCancel={() => setMode("view")}
        // Adiciona novos serviços e volta para lista principal.
        onAdd={(services: any[]) => {
          createServiceDetails(services);
          setMode("view");
        }}
      />
    );
  }

  // =========================
  // MODO: DETALHES DO SERVIÇO
  // =========================
  if (mode === "details" && selectedService) {
    return (
      <ServiceDetails
        serviceDetails={selectedService}
        // Retorna para a lista sem salvar alterações adicionais.
        onBack={() => setMode("view")}
        // Atualiza o valor do serviço e retorna para a lista.
        onSave={async (service_id, price) => {
          await updateServiceDetails(service_id, price);
          setMode("view");
        }}
      />
    );
  }

  // =========================
  // MODO: LISTA PRINCIPAL
  // =========================
  return (
    <ProfileContainer>
      <ProfileCard>

        {/* =========================
            HEADER DA LISTAGEM
           ========================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#21314D]/5 rounded-xl text-[#21314D]">
              <Briefcase size={22} />
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
              Serviços <span className="text-[#21314D]">Ativos</span>
            </h3>
          </div>

          {/* Botão para abrir modo de seleção - Adaptável para mobile */}
          <button
            onClick={() => setMode("select")}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 bg-[#21314D] text-white px-5 py-3 sm:py-2.5 rounded-2xl text-sm font-bold hover:bg-[#1A263D] transition-all active:scale-95 shadow-md shadow-blue-900/10"
          >
            <Plus size={18} strokeWidth={3} />
            Novo Serviço
          </button>
        </div>

        {/* =========================
            CAMPO DE BUSCA
           ========================= */}
        <div className="relative group mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors"
            size={18}
          />

          <input
            type="text"
            placeholder="Pesquisar em meus serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-13 pl-12 pr-4 bg-zinc-100/80 border-2 border-transparent rounded-[20px] text-sm focus:bg-white focus:border-[#21314D]/20 focus:ring-4 focus:ring-[#21314D]/5 outline-none transition-all placeholder:text-zinc-400"
          />
        </div>

        {/* =========================
            LISTA DE SERVIÇOS
           ========================= */}
        <div className="grid grid-cols-1 gap-3">
          {filteredServices.map((service) => (
            <ServiceItem
              key={service.id}
              /**
               * Ao clicar no item, abre tela de detalhes.
               */
              onClick={() => {
                setSelectedService(service);
                setMode("details");
              }}
            >
              {/* Nome e subtitulo informativo */}
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-[#1E1E1E] text-[15px] md:text-base leading-tight">
                  {service.service_name}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  Clique para ver detalhes
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Botões de ação (editar/excluir) */}
                <ServiceActionButtons
                  /**
                   * Abre edição do serviço.
                   * stopPropagation impede disparar o onClick do ServiceItem.
                   */
                  onEdit={(e) => {
                    e.stopPropagation();
                    setSelectedService(service);
                    setMode("details");
                  }}

                  /**
                   * Remove o serviço do usuário.
                   */
                  onDelete={(e) => {
                    e.stopPropagation();
                    removeServiceDetails(service.service_id);
                  }}
                />
              </div>
            </ServiceItem>
          ))}

          {/* Estado vazio da busca */}
          {filteredServices.length === 0 && (
            <div className="py-16 px-6 text-center bg-zinc-50/50 rounded-[32px] border-2 border-dashed border-zinc-200">
              <div className="mx-auto w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-4">
                <Search size={24} />
              </div>
              <p className="text-zinc-500 text-sm md:text-base">
                Nenhum serviço encontrado.
              </p>
            </div>
          )}
        </div>
      </ProfileCard>
    </ProfileContainer>
  );
}


/**
 * Componente visual de item da lista de serviços.
 * 
 * Centraliza os estilos de hover, bordas e animação de clique 
 * para garantir consistência visual entre dispositivos.
 */
const ServiceItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "group flex items-center justify-between p-4 md:p-5",
      "bg-white border border-zinc-100 hover:border-[#21314D]/20",
      "rounded-[24px] cursor-pointer transition-all",
      "hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-[0.98]"
    )}
  >
    {children}
  </div>
);
