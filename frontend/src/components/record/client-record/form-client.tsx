import { useNavigate } from "react-router-dom"
import { useState } from "react"
import LabelForm from "../../ui/label-form"
import ButtonForm from "../../ui/button-form"
import InputForm from "../../ui/input-form"
import SectionForm from "../../ui/section-form"


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
    <SectionForm onSubmit={handleSubmit}>
      <LabelForm title="Nome Completo" />
      <InputForm
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Digite seu nome completo"
      />

      <LabelForm title="CPF" />
      <InputForm
        type="text"
        name="cpf"
        value={formData.cpf}
        onChange={handleChange}
        placeholder="Digite seu CPF"
      />

      <LabelForm title="Email" />
      <InputForm
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Digite seu email"
      />

      <LabelForm title="Senha" />
      <InputForm
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Digite sua senha"
      />

      <LabelForm title="Confirmar Senha" />
      <InputForm
        type="password"
        name="confirmar_senha"
        value={formData.confirmar_senha}
        onChange={handleChange}
        placeholder="Digite sua senha"
      />

      <ButtonForm title="Cadastrar" />
    </SectionForm>
  )
}
