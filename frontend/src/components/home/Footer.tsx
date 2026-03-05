import styled from "styled-components"

const FooterContainer = styled.footer`
  background-color: #f9f9f9;
  padding: 100px 50px 30px 100px;
  border-top: 1px solid #eee;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px,1fr));
  gap: 10px;
`

const Column = styled.div``

const Title = styled.h4`
  color: #333;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`

const List = styled.ul`
  list-style: none;
`

const Item = styled.li`
  margin-bottom: 8px;
`

const LinkItem = styled.a`
  color: #777;
  text-decoration: none;
  font-size: 16px;

  &:hover{
    color:#213555;
  }
`

const Bottom = styled.div`
  text-align: center;
  font-size: 15px;
  color: #999;
  margin-top: 100px;
`

export default function Footer() {
    return (
    <FooterContainer>
        <Grid>
            <Column>
                <Title>Use cases</Title>
                <List>
                    <Item><LinkItem href="#">UI design</LinkItem></Item>
                    <Item><LinkItem href="#">UX design</LinkItem></Item>
                    <Item><LinkItem href="#">Wireframing</LinkItem></Item>
                    <Item><LinkItem href="#">Diagramming</LinkItem></Item>
                </List>
            </Column>
            <Column>
                <Title>Explore</Title>
                <List>
                    <Item><LinkItem href="#">UI design</LinkItem></Item>
                    <Item><LinkItem href="#">UX design</LinkItem></Item>
                    <Item><LinkItem href="#">Wireframing</LinkItem></Item>
                    <Item><LinkItem href="#">Diagramming</LinkItem></Item>
                </List>
            </Column>
            <Column>
                <Title>Resources</Title>
                <List>
                    <Item><LinkItem href="#">UI design</LinkItem></Item>
                    <Item><LinkItem href="#">UX design</LinkItem></Item>
                    <Item><LinkItem href="#">Wireframing</LinkItem></Item>
                    <Item><LinkItem href="#">Diagramming</LinkItem></Item>
                </List>
            </Column>
            <Column>
                <Title>Company</Title>
                <List>
                    <Item><LinkItem href="#">UI design</LinkItem></Item>
                    <Item><LinkItem href="#">UX design</LinkItem></Item>
                    <Item><LinkItem href="#">Wireframing</LinkItem></Item>
                    <Item><LinkItem href="#">Diagramming</LinkItem></Item>
                </List>
            </Column>
            <Column>
                <Title>Contact</Title>
                <LinkItem>Email: info@seudominio.com</LinkItem>
                <LinkItem>Phone: (XX) XXXX-XXXX</LinkItem>
            </Column>
        </Grid>
        <Bottom>
            © 2025 Seu Domínio. Todos os direitos reservados.
        </Bottom>
    </FooterContainer>
    );
}
