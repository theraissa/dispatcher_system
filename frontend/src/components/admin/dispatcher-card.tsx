import styled from "styled-components"

const Card = styled.div`
  background: white;
  border: 1px solid #eaecf0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
`

const Name = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #344054;
`

const Email = styled.span`
  font-size: 14px;
  color: #667085;
`

const Actions = styled.div`
  display: flex;
  gap: 10px;
`

const ApproveButton = styled.button`
  background: #12b76a;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #039855;
  }
`

const RejectButton = styled.button`
  background: #fee4e2;
  color: #d92d20;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #fecdca;
  }
`

export default function AdminDispatcherCard({ dispatcher, onApprove, onReject }) {
    return (
        <Card>
            <Info>
                <Name>{dispatcher.name}</Name>
                <Email>{dispatcher.email}</Email>
            </Info>

            <Actions>
                <ApproveButton onClick={() => onApprove(dispatcher.id)}>
                    Aprovar
                </ApproveButton>

                <RejectButton onClick={() => onReject(dispatcher.id)}>
                    Reprovar
                </RejectButton>
            </Actions>
        </Card>
    )
}
