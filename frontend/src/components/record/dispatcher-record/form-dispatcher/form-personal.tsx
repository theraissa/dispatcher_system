import {Section,Title, Input, Label, Button, InlineFields, InlineField} from "./form-dispatcher.styles"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function FormPersonal() {
  
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome_desp: "",
    cpf_desp: "",
    rg_desp: "", 
    nasc_desp: "",
    tele_pessoal_desp: "",
    tele_comercial: "",
    email_desp: "",
    senha_desp: "",
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

    if (formData.senha_desp !== formData.confirmar_senha) {
      alert("As senhas não coincidem!")
      return
    }

    const dadosParaEnviar = {
      nome_desp: formData.nome_desp,
      cpf_desp: formData.cpf_desp,
      rg_desp: formData.rg_desp,
      nasc_desp: formData.nasc_desp,
      tele_pessoal_desp: formData.tele_pessoal_desp,
      tele_comercial: formData.tele_comercial,
      email_desp: formData.email_desp,
      senha_desp: formData.senha_desp
    }

    const response = await fetch(
      "http://localhost:5000/api/dispatcher-system/client",
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
    <Section>

      <Title>Informações Pessoais</Title>

      <Label>Nome Completo</Label>
      <Input
        type="text"
        name="nome_desp"
        value={formData.nome_desp}
        onChange={handleChange}
        placeholder="Digite seu nome completo"
        required
      />

      <InlineFields>
        <InlineField>
          <Label>CPF</Label>
          <Input
            type="text"
            name="cpf_desp"
            value={formData.cpf_desp}
            onChange={handleChange}
            placeholder="00000000000"
            required
          />
        </InlineField>

        <InlineField>
          <Label>RG</Label>
          <Input 
            type="text" 
            name="rg_desp"  
            value={formData.rg_desp} 
            onChange={handleChange} 
            placeholder="Digite seu RG"
            required
          />
        </InlineField>
      </InlineFields>

      <Label>Data de Nascimento</Label>
      <Input 
        type="date" 
        name="nasc_desp"  
        value={formData.nasc_desp} 
        onChange={handleChange} 
        required
      />
      <Button type="button">Anexar Identidade</Button>

      <Title>Informações de Contato e Login</Title>

      <InlineFields>
        <InlineField>
          <Label>Telefone Pessoal</Label>
          <Input 
            type="text" 
            name="tele_pessoal_desp"
            value={formData.tele_pessoal_desp} 
            onChange={handleChange} 
            required
          />
        </InlineField>

        <InlineField>
          <Label>Telefone Comercial</Label>
          <Input 
            type="text" 
            name="tele_comercial"
            value={formData.tele_comercial} 
            onChange={handleChange} 
            required
          />
        </InlineField>
      </InlineFields>

      <Label>Email</Label>
      <Input 
        type="email" 
        name="email_desp"
        value={formData.email_desp} 
        onChange={handleChange} 
        required
      />

      <InlineFields>
        <InlineField>
          <Label>Senha</Label>
          <Input 
            type="password" 
            name="senha_desp"
            value={formData.senha_desp} 
            onChange={handleChange} 
            required
          />
        </InlineField>

        <InlineField>
          <Label>Confirmar Senha</Label>
          <Input 
            type="password" 
            name="confirmar_senha"
            value={formData.confirmar_senha} 
            onChange={handleChange} 
            required
          />
        </InlineField>
      </InlineFields>

    </Section>
  )
}
