import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AdminDashboardCard from "../../components/admin/dashboard-card";

// =====================
// 🎨 Styled
// =====================

const PageContainer = styled.div`
  padding: 32px;
  background: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #101828;
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: #667085;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
`;

const HighlightCard = styled.div`
  background: linear-gradient(135deg, #213555, #3e5879);
  color: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HighlightText = styled.div`
  display: flex;
  flex-direction: column;
`;

const HighlightTitle = styled.span`
  font-size: 14px;
  opacity: 0.8;
`;

const HighlightValue = styled.span`
  font-size: 28px;
  font-weight: bold;
`;

const HighlightButton = styled.button`
  background: white;
  color: #213555;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f2f4f7;
  }
`;

// =====================
// 📺 Component
// =====================

export default function AdminDashboard() {
    // mock simples
    const pendingDispatchers = 3;
    const totalServices = 8;

    const navigate = useNavigate();

    return (
        <PageContainer>

            {/* HEADER */}
            <Header>
                <TitleSection>
                    <Title>Painel Administrativo</Title>
                    <Subtitle>Gerencie o sistema de forma rápida</Subtitle>
                </TitleSection>
            </Header>

            {/* 🔥 Highlight (destaque principal) */}
            <HighlightCard>
                <HighlightText>
                    <HighlightTitle>Despachantes pendentes</HighlightTitle>
                    <HighlightValue>{pendingDispatchers}</HighlightValue>
                </HighlightText>

                <HighlightButton onClick={() => navigate("/admin/dispatcher")}>
                    Gerenciar
                </HighlightButton>
            </HighlightCard>

            {/* 📊 Grid principal */}
            <Grid>
                <AdminDashboardCard
                    title="Serviços"
                    description="Gerencie os serviços disponíveis no sistema"
                    extra={`${totalServices} cadastrados`}
                    onClick={() => navigate("/admin/services")}
                />

                <AdminDashboardCard
                    title="Despachantes"
                    description="Aprove ou gerencie cadastros de despachantes"
                    extra={`${pendingDispatchers} pendentes`}
                    onClick={() => navigate("/admin/dispatcher")}
                />
            </Grid>

        </PageContainer>
    );
}
