import { useEffect, useState } from "react"
import styled from "styled-components"
import AdminDispatcherList from "../../components/admin/dispatcher-list"

type Dispatcher = {
    id: number
    name: string
    email: string
    cpf: string
}

// =====================
// 🎨 Styled
// =====================

const PageContainer = styled.div`
  padding: 32px;
  background: #f9fafb;
  min-height: 100vh;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #101828;
`

const Subtitle = styled.span`
  font-size: 14px;
  color: #667085;
`

const Badge = styled.div`
  background: #fff1f0;
  color: #d92d20;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
`

const SearchInput = styled.input`
  width: 280px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #d0d5dd;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #213555;
  }
`

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #eaecf0;
`

// =====================
// 📺 Component
// =====================

export default function AdminDispatchers() {
    const [dispatchers, setDispatchers] = useState<Dispatcher[]>([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetch("http://localhost:5000/api/admin/dispatchers?status=pending")
            .then(res => res.json())
            .then(data => setDispatchers(data))
            .catch(err => console.error("Erro ao buscar despachantes:", err))
    }, [])

    function handleApprove(id: number) {
        fetch(`http://localhost:5000/api/admin/dispatcher/${id}/approve`, {
            method: "POST"
        })
            .then(() => {
                setDispatchers(prev => prev.filter(d => d.id !== id))
            })
            .catch(err => console.error("Erro ao aprovar:", err))
    }

    function handleReject(id: number) {
        fetch(`http://localhost:5000/api/admin/dispatcher/${id}/reject`, {
            method: "POST"
        })
            .then(() => {
                setDispatchers(prev => prev.filter(d => d.id !== id))
            })
            .catch(err => console.error("Erro ao rejeitar:", err))
    }

    const filteredDispatchers = dispatchers.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <PageContainer>

            {/* HEADER */}
            <Header>
                <TitleSection>
                    <Title>Despachantes Pendentes</Title>
                    <Subtitle>Gerencie aprovações de cadastro</Subtitle>
                </TitleSection>

                <Badge>
                    {dispatchers.length} pendente{dispatchers.length !== 1 && "s"}
                </Badge>
            </Header>

            {/* SEARCH */}
            <div style={{ marginBottom: 20 }}>
                <SearchInput
                    placeholder="Buscar por nome ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* CARD */}
            <CardContainer>
                <AdminDispatcherList
                    dispatchers={filteredDispatchers}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            </CardContainer>

        </PageContainer>
    )
}
