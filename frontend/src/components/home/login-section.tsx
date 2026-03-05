import styled from "styled-components"

const Section = styled.section`
  padding: 250px;
  text-align: center;
  background-color: #D8C4B6;
`

const Title = styled.h1`
  color: #1E1E1E;
  font-size: 75px;
`

const Text = styled.p`
  font-size: 25px;
  padding: 20px;
  color: #757575;
  margin-bottom: 50px;
`

const Form = styled.div``

const Input = styled.input`
  padding: 10px 250px;
  margin-right: 5px;
  border-radius: 6px;
  border: 1px solid white;
  font-size: 18px;
`

const Button = styled.button`
  padding: 10px 50px;
  border: none;
  background-color: #2C2C2C;
  color: white;
  border-radius: 5px;
  font-size: 18px;
`

export default function LoginSection() {
  return (
    <Section>
      <Title>Despachante de Trânsito</Title>

      <Text>
        Sistema Web para Centralizar Serviços e Comunicação Destinado
      </Text>

      <Form>
        <Input type="email" placeholder="you@example.com" />
        <Button>Entrar</Button>
      </Form>
    </Section>
  )
}
