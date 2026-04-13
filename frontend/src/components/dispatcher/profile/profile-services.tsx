import { useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";

import { ProfileCard, ProfileCardHeader, ProfileContainer } from "./layout/profile-card";
import SelectServices from "./select-services";
import ServiceDetails from "./profile-service-details";
import ServiceActionButtons from "./ui/profile-buttons-action-service";
import { useServiceDetails } from "@/hooks/use-service-details";
import { useAuth } from "@/hooks/use-auth";


const ServiceItem = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
  <div
    onClick={onClick}
    className="group flex items-center justify-between p-4 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 rounded-2xl cursor-pointer transition-all hover:shadow-md"
  >
    {children}
  </div>
);

export default function ProfileServices() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"view" | "select" | "details">("view");
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const { user } = useAuth();

  const { serviceDetails, allServices, loading, createServiceDetails, updateServiceDetails, removeServiceDetails } = useServiceDetails(user?.dispatcherId);

  const filteredServices = serviceDetails.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center p-20 text-zinc-400">
      <Loader2 className="animate-spin mr-2" /> Carregando serviços...
    </div>
  );


  // =========================
  // Tela de seleção
  // =========================
  if (mode === "select") {
    const availableServices = allServices.filter(
      (s) => !serviceDetails.some((userService) => userService.id === s.id)
    );

    return (
      <SelectServices
        availableServices={availableServices}
        onCancel={() => setMode("view")}
        onAdd={(services) => {
          createServiceDetails(services);
          setMode("view");
        }}
      />
    );
  }

  // =========================
  // Tela de detalhes
  // =========================
  if (mode === "details" && selectedService) {
    return (
      <ServiceDetails
        service={selectedService}
        onBack={() => setMode("view")}
        onSave={async (id, price) => {
          await updateServiceDetails(id, price);
          setMode("view");
        }}
      />
    );
  }
  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileCardHeader>
          <h3 className="text-xl font-extrabold text-[#1E1E1E] tracking-tight">
            Serviços <span className="text-[#21314D]">Ativos</span>
          </h3>

          <button
            onClick={() => setMode("select")}
            className="flex items-center gap-2 bg-[#21314D] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#1A263D] transition-all active:scale-95 shadow-sm"
          >
            <Plus size={18} />
            Novo Serviço
          </button>
        </ProfileCardHeader>

        {/* Input de Busca */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Pesquisar em meus serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-zinc-100 border-none rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#21314D]/10 outline-none transition-all"
          />
        </div>

        {/* Lista de Serviços */}
        <div className="flex flex-col gap-3">
          {filteredServices.map((service) => (
            <ServiceItem key={service.id} onClick={() => { setSelectedService(service); setMode("details"); }}>
              <span className="font-bold text-[#333] text-sm md:text-base">
                {service.name}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full group-hover:bg-white transition-colors">
                  Ver detalhes
                </span>
                <ServiceActionButtons
                  onEdit={(e) => { e.stopPropagation(); setSelectedService(service); setMode("details"); }}
                  onDelete={(e) => { e.stopPropagation(); removeServiceDetails(service.id); }}
                />
              </div>
            </ServiceItem>
          ))}

          {filteredServices.length === 0 && (
            <div className="py-12 text-center bg-zinc-50 rounded-[32px] border-2 border-dashed border-zinc-200">
              <p className="text-zinc-500 text-sm">
                Nenhum serviço encontrado para <span className="text-[#21314D] font-bold">"{search}"</span>
              </p>
            </div>
          )}
        </div>
      </ProfileCard>
    </ProfileContainer>
  );
}
