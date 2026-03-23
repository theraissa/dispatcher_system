import styled from "styled-components"

const Header = styled.header`
  width: 100%;
  background-color: #213555;
  color: white;
  height: 70px;
  padding: 10px;
  display: flex;
  justify-content: end;
  align-items: center;
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
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
  cursor: pointer;

  &:hover {
    background-color: white;
    color: #213555;
  }
`

export default function NavbarPage() {
  return (
    <Header>
      <Nav>
        <Buttons>
          <Button>Chamados</Button>
          <Button>Seu Perfil</Button>
        </Buttons>
      </Nav>
    </Header>
  )
}
