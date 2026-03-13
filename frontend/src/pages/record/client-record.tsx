import styled from "styled-components"
import CardInfo from "../../components/record/client-record/card-info"
import FormClient from "../../components/record/client-record/form-client"
import Navbar from "../../components/ui/navbar-with-title"


const Main = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 100px;
`

export default function ClientRecord() {
  return (
    <>
      <Navbar title={"Olá, Cliente."} />
      <Main>
        <CardInfo />
        <FormClient />
      </Main>
    </>
  )
}
