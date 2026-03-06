import styled from "styled-components"

const Header = styled.header`
  width: 100%;
  background-color: #213555;
  color: white;
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
`

const Title = styled.h1`
  font-size: 24px;
`

const Buttons = styled.div`
  display: flex;
  gap: 10px;
`

const Button = styled.a`
  padding: 7px 18px;
  background-color: #3E5879;
  color: white;
  text-decoration: none;
  border-radius: 10px;

  &:hover {
    background-color: white;
    color: #213555;
  }
`

export default function Navbar() {
  return (
    <Header>
      <Nav>
        <Title>Despachantes e Serviços</Title>
        <Buttons>
          <Button>Despachantes</Button>
          <Button>Chamados</Button>
          <Button>Seu Perfil</Button>
        </Buttons>
      </Nav>
    </Header>
  )
}
