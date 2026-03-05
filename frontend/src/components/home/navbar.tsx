import styled from "styled-components"
import { Link } from "react-router-dom"

const Header = styled.header`
  width: 100%;
  height: 70px;
  padding: 10px;
  display: flex;
  justify-content: end;
  align-items: center;
  background-color: #213555;
  color: white;
`

const Nav = styled.nav``

const List = styled.ul`
  list-style: none;
  margin-right: 80px;
`

const Item = styled.li`
  display: inline;
  margin-right: 10px;
`

const BaseButton = styled(Link)`
  color: white;
  font-size: 18px;
  text-decoration: none;
  padding: 7px 18px;
  border-radius: 10px;

  &:hover {
    background-color: #3E5879;
  }
`

const LoginButton = styled(BaseButton)`
  background-color: white;
  color: #213555;

  &:hover {
    background-color: #3E5879;
    color: white;
  }
`

const CadastroButton = styled(BaseButton)`
  color: white;
  font-size: 18px;
  text-decoration: none;
  padding: 7px 18px;
  background-color: #3E5879;
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
        <List>
          <Item><BaseButton href="#">Funcionalidades</BaseButton></Item>
          <Item><BaseButton href="#">Sobre</BaseButton></Item>
          <Item><LoginButton href="#">Login</LoginButton></Item>
          <Item><CadastroButton to="/cadastro">Cadastrar</CadastroButton></Item>
        </List>
      </Nav>
    </Header>
  )
}
