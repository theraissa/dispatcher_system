import styled from "styled-components"

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

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const dadosParaEnviar = Object.fromEntries(formData)

    if (dadosParaEnviar.senha_cliente !== dadosParaEnviar.confirmar_senha) {
      alert("As senhas não coincidem!")
      return
    }

    delete dadosParaEnviar.confirmar_senha

    await fetch('http://localhost:5000/api/dispatcher-system/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosParaEnviar),
    })

    alert("Usuário Criado!")
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>

        <Label>Nome Completo</Label>
        <Input type="text" name="nome_cliente" placeholder="Digite seu nome completo" required/>

        <Label>CPF</Label>
        <Input type="text" name="cpf_cliente" placeholder="Digite seu CPF" required/>

        <Label>Email</Label>
        <Input type="email" name="email_cliente" placeholder="Digite seu email" required/>

        <Label>Senha</Label>
        <Input type="password" name="senha_cliente" placeholder="Digite sua senha" required/>

        <Label>Confirmar Senha</Label>
        <Input type="password" name="confirmar_senha" placeholder="Digite sua senha" required/>

        <Button type="submit">Cadastrar</Button>

      </Form>
    </Container>
  )
}
