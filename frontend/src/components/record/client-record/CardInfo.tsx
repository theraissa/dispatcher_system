import styled from "styled-components"

const Section = styled.section`
  width: 40%;
`

const Title = styled.h2`
  font-size: 75px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1E1E1E;
`

const Text = styled.p`
  font-size: 20px;
  color: #1E1E1E;
`

export default function CardInfo() {
  return (
    <Section>
      <Title>Complete as Lacunas</Title>
      <Text>
        De início solicitamos poucas informações, apenas para conseguir acessar
        o sistema, mas quando desejar solicitar algum serviço será necessário
        completar o perfil.
      </Text>
    </Section>
  )
}
