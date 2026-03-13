import styled from "styled-components"

const Header = styled.header`
  width: 100%;
  height: 70px;
  background-color: #213555;
  color: white;
`

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const Title = styled.h1`
  font-size: 30px;
`

export default function Navbar({ title }) {
  return (
    <Header>
      <Nav>
        <Title>{title}</Title>
      </Nav>
    </Header>
  )
}
