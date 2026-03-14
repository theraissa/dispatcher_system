import styled from "styled-components"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

const Form = styled.form``

const Input = styled.input`
  padding: 10px;
  width: 700px;
  max-width: 90%;
  margin-right: 5px;
  border-radius: 6px;
  border: 1px solid white;
  font-size: 18px;
  text-align: center;
`

const Button = styled.button`
  padding: 10px 50px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background-color: #555;
  }
`

export default function LoginSection() {
  // Estado para armazenar o email digitado pelo usuário
  const [email, setEmail] = useState("")

  // Hook do React Router usado para redirecionar entre páginas
  const navigate = useNavigate()

  function handleSubmit(event) {
    // Evita o comportamento padrão do form (recarregar a página)
    event.preventDefault()

    // Redireciona para a tela de login enviando o email via state
    // Isso permite que o campo de email já venha preenchido na próxima tela
    navigate("/login", {
      state: { email }
    })
  }

  return (
    <Section>
      <Title>Despachante de Trânsito</Title>
      <Text>Sistema Web para Centralizar Serviços e Comunicação Destinado</Text>

      {/* Ao submeter o formulário, chamamos handleSubmit */}
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          // Atualiza o estado sempre que o usuário digita no input
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit">Entrar</Button>
      </Form>
    </Section>
  )
}
