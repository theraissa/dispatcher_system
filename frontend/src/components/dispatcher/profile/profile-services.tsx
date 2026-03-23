import { useEffect, useState } from "react";
import styled from "styled-components";
import SelectServices from "./select-services";
import ProfileContainer from "./layout/profile-container";
import ProfileCard from "./layout/profile-card";
import ProfileCardHeader from "./layout/profile-card-header";
import TitleTemplate from "../../ui/title";
import ProfileSearchContainer from "./layout/profile-search-container";
import ProfileSearchInput from "./ui/profile-search-input";
import ProfileEmptyState from "./layout/profile-empty-state";
import ButtonAddService from "./ui/profile-button-add-service";
import ServiceDetails from "./profile-service-details";



const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ServiceItem = styled.div`
  background: white;
  border: 1px solid #eaecf0;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #213555;
    background: #fcfcfd;
    transform: translateX(4px);
  }
`;

const ServiceName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #344054;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: #f2f4f7;
  color: #344054;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  transition: 0.2s;

  &:hover {
    background: #e4e7ec;
  }
`;

const RemoveButton = styled(ActionButton)`
  background: #fff1f0;
  color: #d92d20;

  &:hover {
    background: #fee4e2;
  }
`;

export default function ProfileServices() {
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"view" | "select" | "details">("view");
  const [selectedService, setSelectedService] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  // =========================
  // Buscar serviços do despachante
  // =========================
  useEffect(() => {
    if (!storedUser?.id) return;

    fetch(`http://localhost:5000/api/dispatcher-system/dispatcher/${storedUser.id}/services`)
      .then(res => res.json())
      .then(data => {
        setServices(data); // ideal: [{ id, name, price }]
      });
  }, [storedUser]);

  // =========================
  // Buscar catálogo global
  // =========================
  useEffect(() => {
    fetch("http://localhost:5000/api/dispatcher-system/service")
      .then(res => res.json())
      .then(data => setAllServices(data));
  }, []);

  // =========================
  // Remover serviço
  // =========================
  function handleRemove(serviceId) {
    fetch(
      `http://localhost:5000/api/dispatcher-system/dispatcher/${storedUser.id}/service/${serviceId}`,
      { method: "DELETE" }
    ).then(() => {
      setServices(prev => prev.filter(s => s.id !== serviceId));
    });
  }

  // =========================
  // Adicionar serviço
  // =========================
  function handleAdd(newServices) {
    Promise.all(
      newServices.map(service =>
        fetch(
          `http://localhost:5000/api/dispatcher-system/dispatcher/${storedUser.id}/service/${service.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        )
      )
    ).then(() => {
      setServices(prev => [...prev, ...newServices]);
      setMode("view");
    });
  }

  // =========================
  // Filtro
  // =========================
  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // Tela de seleção
  // =========================
  if (mode === "select") {
    const availableServices = allServices.filter(
      s => !services.some(userService => userService.id === s.id)
    );

    return (
      <SelectServices
        availableServices={availableServices}
        onCancel={() => setMode("view")}
        onAdd={handleAdd}
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
        onSave={(updated) => {
          setServices(prev =>
            prev.map(s =>
              s.service_id === updated.service_id ? updated : s
            )
          )
          setMode("view")
        }}
      />
    );
  }

  // =========================
  // Tela principal
  // =========================
  return (
    <ProfileContainer>
      <ProfileCard>

        <ProfileCardHeader>
          <TitleTemplate title="Serviços Ativos" />
          <ButtonAddService onClick={() => setMode("select")}>
            + Novo Serviço
          </ButtonAddService>
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
              key={service.service_id}
              onClick={() => {
                setSelectedService(service)
                setMode("details")
              }}
            >
              <ServiceName>{service.name}</ServiceName>

              <Actions>
                <ActionButton onClick={() => {
                  setSelectedService(service)
                  setMode("details")
                }}>
                  Editar
                </ActionButton>

                <RemoveButton onClick={() => handleRemove(service.service_id)}>
                  Excluir
                </RemoveButton>

              </Actions>
            </ServiceItem>
          ))}

          {filteredServices.length === 0 && (
            <ProfileEmptyState>
              <p>Nenhum serviço encontrado para "<strong>{search}</strong>"</p>
            </ProfileEmptyState>
          )}
        </ServiceList>

      </ProfileCard>
    </ProfileContainer>
  );
}
