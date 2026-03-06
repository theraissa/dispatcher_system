import styled from "styled-components"
import CardDispatcher from "../../components/client/initial-search-disp/card"
import Navbar from "../../components/client/initial-search-disp/navbar"
import Search from "../../components/client/initial-search-disp/search"

const Main = styled.main`
  padding: 20px;
  text-align: center;
`

export default function InitialSearchDisp() {
  return (
    <>
      <Navbar />
      <Main>
        <Search />
        <CardDispatcher />
      </Main>
    </>
  )
}
