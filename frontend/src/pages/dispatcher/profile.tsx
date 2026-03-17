import { useState } from "react"
import styled from "styled-components"
import NavbarPage from "../../components/ui/navbar-page"
import ProfileInfo from "../../components/dispatcher/profile/profile-info"
import ProfileServices from "../../components/dispatcher/profile/profile-services"


const Container = styled.div`
  padding: 40px;
`

const Layout = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: flex-start;
`

const Content = styled.div`
  flex: 1;
`

const SideMenu = styled.div`
  width: 250px;
  background: white;
  padding: 18px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,0.08);

  display: flex;
  flex-direction: column;
  gap: 10px;

  position: sticky;
  top: 20px;
`

const MenuButton = styled.button<{ active: boolean }>`
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 15px;
  font-weight: bold;

  background-color: ${({ active }) => (active ? "#213555" : "#f2f2f2")};
  color: ${({ active }) => (active ? "white" : "#213555")};

  transition: 0.2s;

  &:hover {
    background-color: ${({ active }) => (active ? "#213555" : "#e6e6e6")};
  }
`


export default function ProfilePage() {

  const [tab, setTab] = useState<"info" | "services">("info")

  return (
    <>
      <NavbarPage />

      <Container>
        <Layout>

          <Content>
            {tab === "info" && <ProfileInfo />}
            {tab === "services" && <ProfileServices />}
          </Content>

          <SideMenu>

            <MenuButton
              active={tab === "info"}
              onClick={() => setTab("info")}
            >
              Informações
            </MenuButton>
            <MenuButton
              active={tab === "services"}
              onClick={() => setTab("services")}
            >
              Serviços
            </MenuButton>

          </SideMenu>

        </Layout>
      </Container>
    </>
  )
}
