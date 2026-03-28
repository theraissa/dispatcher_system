import { useState } from "react";
import styled from "styled-components";
import ProfileContainer from "./layout/profile-container";
import ProfileCard from "./layout/profile-card";
import TitleTemplate from "../../ui/title";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #344054;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d0d5dd;
  font-size: 15px;
  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #213555;
    box-shadow: 0 0 0 2px rgba(33, 53, 85, 0.1);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  border-top: 1px solid #eaecf0;
  padding-top: 20px;
`;

const BackButton = styled.button`
  background: transparent;
  color: #667085;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #f2f4f7;
    color: #101828;
  }
`;

const SaveButton = styled.button`
  background: #213555;
  color: white;
  border: none;
  padding: 12px 26px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #1a2a44;
    box-shadow: 0 4px 12px rgba(33, 53, 85, 0.2);
  }
`;


type Service = {
  id: number;
  name: string;
  price?: number;
};

type Props = {
  service: Service;
  onBack: () => void;
  onSave: (serviceId: number, price: number) => Promise<void>;
};

export default function ServiceDetails({
  service,
  onBack,
  onSave
}: Props) {
  const [price, setPrice] = useState(service.price || "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    try {
      setLoading(true);
      await onSave(service.id, Number(price));
      onBack();
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProfileContainer>
      <ProfileCard>

        <TitleTemplate title="Editar serviço" />
        <p style={{ color: "#667085", marginTop: 4 }}>
          {service.name}
        </p>

        <Content>
          <Field>
            <Label>Valor do serviço</Label>
            <Input
              type="number"
              placeholder="Ex: 150.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Field>
        </Content>

        <Footer>
          <BackButton onClick={onBack}>
            Voltar
          </BackButton>

          <SaveButton onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </SaveButton>
        </Footer>

      </ProfileCard>
    </ProfileContainer>
  );
}
