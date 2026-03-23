import styled from "styled-components";

const Card = styled.div`
  background: white;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;

  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    border-color: #213555;
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #101828;
`;

const Description = styled.p`
  font-size: 14px;
  color: #667085;
`;

type Props = {
    title: string;
    description: string;
    onClick?: () => void;
};

export default function AdminDashboardCard({ title, description, onClick }: Props) {
    return (
        <Card onClick={onClick}>
            <Title>{title}</Title>
            <Description>{description}</Description>
        </Card>
    );
}
