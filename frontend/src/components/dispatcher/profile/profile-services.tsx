import { useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";

import { ProfileCard, ProfileCardHeader, ProfileContainer } from "./layout/profile-card";
import SelectServices from "./select-services";
import ServiceDetails from "./profile-service-details";
import ServiceActionButtons from "./ui/profile-buttons-action-service";
import { useServiceDetails } from "@/hooks/use-service-details";


/**
 * Componente responsável por gerenciar os serviços do usuário (dispatcher).
 *
 * Ele controla três fluxos principais:
 * - Visualização dos serviços ativos
 * - Seleção de novos serviços
 * - Edição de detalhes de um serviço específico
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
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center p-20 text-zinc-400">
      <Loader2 className="animate-spin mr-2" />
      Carregando serviços...
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
      (s) => !serviceDetails.some((userService) => userService.id === s.id)
    );

    return (
      <SelectServices
        availableServices={availableServices}
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
        <ProfileCardHeader>
          <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
            Serviços <span className="text-[#21314D]">Ativos</span>
          </h3>

          {/* Botão para abrir modo de seleção */}
          <button
            onClick={() => setMode("select")}
            className="cursor-pointer flex items-center gap-2 bg-[#21314D] text-white px-4 py-2 rounded-xl text-[15px] font-bold hover:bg-[#1A263D] transition-all active:scale-95 shadow-sm"
          >
            <Plus size={20} strokeWidth={3} />
            Novo Serviço
          </button>
        </ProfileCardHeader>

        {/* =========================
            CAMPO DE BUSCA
           ========================= */}
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors"
            size={18}
          />

          <input
            type="text"
            placeholder="Pesquisar em meus serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-zinc-100 border-none rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#21314D]/10 outline-none transition-all"
          />
        </div>

        {/* =========================
            LISTA DE SERVIÇOS
           ========================= */}
        <div className="flex flex-col gap-3">
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
              {/* Nome do serviço */}
              <span className="font-bold text-[#333] text-sm md:text-base">
                {service.name}
              </span>

              <div className="flex items-center gap-2">

                {/* Botões de ação (editar/excluir) */}
                <ServiceActionButtons
                  /**
                   * Abre edição do serviço.
                   * stopPropagation impede abrir o item automaticamente.
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
            <div className="py-12 text-center bg-zinc-50 rounded-[32px] border-2 border-dashed border-zinc-200">
              <p className="text-zinc-500 text-sm">
                Nenhum serviço encontrado para{" "}
                <span className="text-[#21314D] font-bold">
                  "{search}"
                </span>
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
    className="group flex items-center justify-between p-4 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 rounded-2xl cursor-pointer transition-all hover:shadow-md"
  >
    {children}
  </div>
);
