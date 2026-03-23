import styled from "styled-components"
import AdminDispatcherCard from "./dispatcher-card"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export default function AdminDispatcherList({ dispatchers, onApprove, onReject }) {
    return (
        <Container>
            {dispatchers.map(d => (
                <AdminDispatcherCard
                    key={d.id}
                    dispatcher={d}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            ))}

            {dispatchers.length === 0 && (
                <p>Nenhum despachante pendente</p>
            )}
        </Container>
    )
}
