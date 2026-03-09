import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Container = styled.section`
  width: 40%;
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  margin-right: 200px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 18px;
  margin-top: 20px;
  padding: 5px;
  font-weight: bold;
`

const Input = styled.input`
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
`

const Button = styled.button`
  margin-top: 20px;
  padding: 8px;
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

export default function FormClient() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirmar_senha: ""
  })

  function handleChange(event: any) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  async function handleSubmit(event: any) {
    event.preventDefault()

    if (formData.password !== formData.confirmar_senha) {
      alert("As senhas não coincidem!")
      return
    }

    const dadosParaEnviar = {
      name: formData.name,
      cpf: formData.cpf,
      email: formData.email,
      password: formData.password
    }

    const response = await fetch(
      "http://localhost:5000/api/dispatcher-system/user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosParaEnviar)
      }
    )

    if (response.ok) {
      alert("Usuário Criado!")
      navigate("/initial/search-dispatcher")
    } else {
      alert("Erro ao criar usuário")
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>

        <Label>Nome Completo</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Digite seu nome completo"
          required
        />

        <Label>CPF</Label>
        <Input
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="Digite seu CPF"
          required
        />

        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu email"
          required
        />

        <Label>Senha</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
          required
        />

        <Label>Confirmar Senha</Label>
        <Input
          type="password"
          name="confirmar_senha"
          value={formData.confirmar_senha}
          onChange={handleChange}
          placeholder="Digite sua senha"
          required
        />

        <Button type="submit">Cadastrar</Button>

      </Form>
    </Container>
  )
}
