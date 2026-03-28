import styled from "styled-components"

const Container = styled.div`
  display: flex;
  justify-content: center;
`

const Card = styled.div`
  position: relative;
  display: flex;
  width: 1445px;
  max-width: 100%;
  padding: 40px;
  align-items: center;
  gap: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`

const Photo = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #ddd;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const Name = styled.h2`
  margin: 0;
`

const Socials = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 20px;
`

const Social = styled.a`
  font-size: 16px;
  color: black;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const EditButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;

  padding: 7px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  
  background-color: #333;
  color: white;
`


export default function ProfileHeader({ user, profile, setIsEditing, isEditing }) {

  return (
    <Container>
      <Card>

        <EditButton onClick={() => setIsEditing(prev => !prev)}>
          {isEditing ? "Salvar" : "Editar"}
        </EditButton>

        {/* Foto de Perfil do Despachante */}
        <Photo style={{
          backgroundImage: `url(${user.photo_url || ""})`,
          backgroundSize: "cover"
        }} />

        {/* Nome do Despachante e Link com as Redes Sociais */}
        <Info>
          <Name>{user.name || "Nome do Despachante"}</Name>
          <span>{user.contact}</span>

          <Socials>
            {profile.instagram && <Social href={profile.instagram}>Instagram</Social>}
            {profile.whatsapp && <Social href={`https://wa.me/${profile.whatsapp}`}>WhatsApp</Social>}
            {profile.website && <Social href={profile.website}>Website</Social>}
          </Socials>
        </Info>

      </Card>
    </Container>
  )
}
