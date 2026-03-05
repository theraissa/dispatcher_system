import styled from "styled-components"
import HeaderClient from "../../components/record/client-record/header-client"
import CardInfo from "../../components/record/client-record/card-info"
import FormClient from "../../components/record/client-record/form-client"

const Page = styled.div`
  min-height: 100vh;
  background-color: #F5EFE7;
`

const Main = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 100px;
`

export default function ClientRecord() {
  return (
    <Page>
      <HeaderClient />
      <Main>
        <CardInfo />
        <FormClient />
      </Main>
    </Page>
  )
}
