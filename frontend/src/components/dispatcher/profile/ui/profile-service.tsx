import styled from "styled-components";


export const ServiceList = styled.div`
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

export const ServiceItem = styled.div`
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

export const ServiceItemAdd = styled.div<{ selected: boolean }>`
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

export const ServiceName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #344054;
`;


export const AddServiceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background-color: #213555;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: #1a2a44;
    box-shadow: 0 4px 12px rgba(33, 53, 85, 0.25);
  }
`;
