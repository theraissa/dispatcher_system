import { useState } from "react"
import styled from "styled-components"
import ProfileContainer from "./layout/profile-container"
import ProfileCard from "./layout/profile-card"
import TitleTemplate from "../../ui/title"
import ProfileSearchInput from "./ui/profile-search-input"
import ProfileEmptyState from "./layout/profile-empty-state"


const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 380px; /* Evita que o card fique gigante */
  overflow-y: auto;
  padding-right: 6px;

  /* Custom Scrollbar */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #d0d5dd; border-radius: 10px; }
`

const ServiceItem = styled.div<{ selected: boolean }>`
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid ${({ selected }) => selected ? "#213555" : "#eaecf0"};
  background: ${({ selected }) => selected ? "#f8fafc" : "#fff"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #213555;
    background: #f8fafc;
  }

  /* Indicador visual de seleção */
  &::after {
    content: '${({ selected }) => selected ? "✓" : "+"}';
    font-weight: bold;
    font-size: 18px;
    color: ${({ selected }) => selected ? "#213555" : "#d0d5dd"};
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid #eaecf0;
`

const CancelButton = styled.button`
  background: transparent;
  color: #667085;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: 0.2s;

  &:hover {
    color: #101828;
    background-color: #f2f4f7;
  }
`

const AddButton = styled.button`
  background: #213555;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
  
  &:disabled {
    background: #d0d5dd;
    cursor: not-allowed;
    transform: none;
  }

  &:hover:not(:disabled) {
    background: #1a2a44;
    box-shadow: 0 4px 12px rgba(33, 53, 85, 0.2);
  }
`

type Service = {
  id: number
  name: string
}

type Props = {
  availableServices: Service[]
  onAdd: (services: Service[]) => void
  onCancel: () => void
}

export default function SelectServices({
  availableServices,
  onAdd,
  onCancel
}: Props) {
  const [search, setSearch] = useState("")
  const [selectedServices, setSelectedServices] = useState<Service[]>([])

  function toggleService(service: Service) {
    setSelectedServices(prev =>
      prev.some(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    )
  }

  const filteredServices = availableServices.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProfileContainer>
      <ProfileCard>

        <TitleTemplate title="Adicionar Serviços" />

        <ProfileSearchInput
          placeholder="Pesquisar serviços..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ServiceList>
          {filteredServices.map(service => {
            const isSelected = selectedServices.some(s => s.id === service.id)

            return (
              <ServiceItem
                key={service.id}
                selected={isSelected}
                onClick={() => toggleService(service)}
              >
                <span style={{ fontWeight: 500 }}>
                  {service.name}
                </span>
              </ServiceItem>
            )
          })}

          {filteredServices.length === 0 && (
            <ProfileEmptyState>
              Nenhum serviço disponível para "{search}"
            </ProfileEmptyState>
          )}
        </ServiceList>

        <Footer>
          <CancelButton onClick={onCancel}>
            Voltar
          </CancelButton>

          <AddButton
            disabled={selectedServices.length === 0}
            onClick={() => onAdd(selectedServices)}
          >
            Adicionar {selectedServices.length > 0 && `(${selectedServices.length})`}
          </AddButton>
        </Footer>

      </ProfileCard>
    </ProfileContainer>
  )
}
