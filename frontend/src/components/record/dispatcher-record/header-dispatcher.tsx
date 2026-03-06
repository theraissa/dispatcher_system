import styled from "styled-components"

const Header = styled.header`
  width: 100%;
  height: 70px;
  padding: 10px;
  background-color: #213555;
`

const Nav = styled.nav`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  font-weight: bold;
  color: white;
`

export default function HeaderDispatcher() {
  return (
    <Header>
      <Nav>
        <Title>Olá, Despachante</Title>
      </Nav>
    </Header>
  )
}
