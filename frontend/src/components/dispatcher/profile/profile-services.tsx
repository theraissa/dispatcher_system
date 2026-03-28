import { useState } from "react";
import SelectServices from "./select-services";
import ProfileContainer from "./layout/profile-container";
import ProfileCard from "./layout/profile-card";
import ProfileCardHeader from "./layout/profile-card-header";
import TitleTemplate from "../../ui/title";
import ProfileSearchContainer from "./layout/profile-search-container";
import ProfileSearchInput from "./ui/profile-search-input";
import ProfileEmptyState from "./layout/profile-empty-state";
import ServiceDetails from "./profile-service-details";
import {
  ServiceList,
  ServiceItem,
  ServiceName,
  AddServiceButton
} from "./ui/profile-service";
import ServiceActionButtons from "./ui/profile-buttons-action-service";
import { useProfileServices } from "../../../hooks/use-profile-service";

type Service = {
  id: number;
  name: string;
  price?: number;
};

export default function ProfileServices() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"view" | "select" | "details">("view");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const {
    services,
    allServices,
    loading,
    removeService,
    addServices
  } = useProfileServices(storedUser?.id);

  // =========================
  // Filtro
  // =========================
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // Tela de seleção
  // =========================
  if (mode === "select") {
    const availableServices = allServices.filter(
      (s) => !services.some((userService) => userService.id === s.id)
    );

    return (
      <SelectServices
        availableServices={availableServices}
        onCancel={() => setMode("view")}
        onAdd={(services) => {
          addServices(services);
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
        onSave={() => {
          setMode("view");
        }}
      />
    );
  }

  // =========================
  // Loading
  // =========================
  if (loading) {
    return <p>Carregando serviços...</p>;
  }

  // =========================
  // Tela principal
  // =========================
  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileCardHeader>
          <TitleTemplate title="Serviços Ativos" />
          <AddServiceButton onClick={() => setMode("select")}>
            + Novo Serviço
          </AddServiceButton>
        </ProfileCardHeader>

        <ProfileSearchContainer>
          <ProfileSearchInput
            placeholder="Pesquisar em meus serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </ProfileSearchContainer>

        <ServiceList>
          {filteredServices.map((service) => (
            <ServiceItem
              key={service.id}
              onClick={() => {
                setSelectedService(service);
                setMode("details");
              }}
            >
              <ServiceName>{service.name}</ServiceName>

              <ServiceActionButtons
                onEdit={() => {
                  setSelectedService(service);
                  setMode("details");
                }}
                onDelete={() => removeService(service.id)}
              />
            </ServiceItem>
          ))}

          {filteredServices.length === 0 && (
            <ProfileEmptyState>
              <p>
                Nenhum serviço encontrado para "<strong>{search}</strong>"
              </p>
            </ProfileEmptyState>
          )}
        </ServiceList>
      </ProfileCard>
    </ProfileContainer>
  );
}
