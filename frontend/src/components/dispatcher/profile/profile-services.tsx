import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useServiceDetails } from "@/hooks/use-service-details";
import { cn } from "@/lib/utils";
import { Briefcase, Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { ProfileCard, ProfileContainer } from "./layout/profile-card";
import ServiceDetails from "./profile-service-details";
import SelectServices from "./select-services";
import ServiceActionButtons from "./ui/profile-buttons-action-service";



export default function ProfileServices({ dispatcherId }: { dispatcherId: number }) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"view" | "select" | "details">("view");
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const {
    serviceDetails,
    allServices,
    loading,
    pagination,
    fetchData,
    createServiceDetails,
    updateServiceDetails,
    removeServiceDetails
  } = useServiceDetails(dispatcherId);

  const filteredServices = serviceDetails.filter((s) =>
    s.service_name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchData(newPage);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
      <Loader2 className="animate-spin mb-4" size={32} />
      <span className="font-medium">Carregando seus serviços...</span>
    </div>
  );

  if (mode === "select") {
    const availableServices = allServices.filter(
      (s) => !serviceDetails.some(
        (userService) => userService.id === s.id || userService.service_id === s.id
      )
    );

    return (
      <SelectServices
        availableServices={availableServices}
        currentServices={serviceDetails as any[]}
        onCancel={() => setMode("view")}
        onAdd={(services: any[]) => {
          createServiceDetails(services);
          setMode("view");
        }}
      />
    );
  }

  if (mode === "details" && selectedService) {
    return (
      <ServiceDetails
        serviceDetails={selectedService}
        onBack={() => setMode("view")}
        onSave={async (service_id, price) => {
          await updateServiceDetails(service_id, price);
          setMode("view");
        }}
      />
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        {/* HEADER DA LISTAGEM */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#21314D]/5 rounded-xl text-[#21314D]">
              <Briefcase size={22} />
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
              Serviços <span className="text-[#21314D]">Ativos</span>
            </h3>
          </div>

          <button
            onClick={() => setMode("select")}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 bg-[#21314D] text-white px-5 py-3 sm:py-2.5 rounded-2xl text-sm font-bold hover:bg-[#1A263D] transition-all active:scale-95 shadow-md shadow-blue-900/10"
          >
            <Plus size={18} strokeWidth={3} />
            Novo Serviço
          </button>
        </div>

        {/* CAMPO DE BUSCA */}
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

        {/* LISTA DE SERVIÇOS */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {filteredServices.map((service) => (
            <ServiceItem
              key={service.id}
              onClick={() => {
                setSelectedService(service);
                setMode("details");
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-[#1E1E1E] text-[15px] md:text-base leading-tight">
                  {service.service_name}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  Clique para ver detalhes
                </span>
              </div>

              <div className="flex items-center gap-1">
                <ServiceActionButtons
                  onEdit={(e) => {
                    e.stopPropagation();
                    setSelectedService(service);
                    setMode("details");
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    removeServiceDetails(service.service_id);
                  }}
                />
              </div>
            </ServiceItem>
          ))}

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

        {/* =========================
            COMPONENTE DE PAGINAÇÃO
           ========================= */}
        {pagination.pages > 1 && (
          <div className="mt-6 pt-4 border-t border-zinc-100">
            <Pagination>
              <PaginationContent>

                {/* Botão Voltar */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.page - 1);
                    }}
                    className={cn(
                      "cursor-pointer",
                      pagination.page === 1 && "pointer-events-none opacity-40"
                    )}
                  />
                </PaginationItem>

                {/* Gera os botões baseados no pagination.pages (que vai valer 2) */}
                {Array.from({ length: pagination.pages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pagination.page === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        className="cursor-pointer font-bold rounded-xl"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {/* Botão Avançar */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.page + 1);
                    }}
                    className={cn(
                      "cursor-pointer",
                      pagination.page === pagination.pages && "pointer-events-none opacity-40"
                    )}
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
            <div className="text-center text-xs md:text-base text-zinc-400 mt-2 font-medium">
              Mostrando {filteredServices.length} de {pagination.total} serviços ativos.
            </div>
          </div>
        )}

      </ProfileCard>
    </ProfileContainer>
  );
}

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
