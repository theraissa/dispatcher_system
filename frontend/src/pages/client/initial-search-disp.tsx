import styled from "styled-components"
import CardDispatcher from "../../components/client/initial-search-disp/card"
import NavbarPage from "../../components/ui/navbar-page"
import Search from "../../components/client/initial-search-disp/search"

const Main = styled.main`
  padding: 20px;
  text-align: center;
`

export default function InitialSearchDisp() {
  return (
    <>
      <NavbarPage />
      <Main>
        <Search />
        <CardDispatcher />
      </Main>
    </>
  )
}
