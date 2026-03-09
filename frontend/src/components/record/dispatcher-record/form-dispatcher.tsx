import { Main, Form, Container, SubmitButton } from "./form-dispatcher/form-dispatcher.styles"
import FormCommercial from "./form-dispatcher/form-commercial"
import FormPersonal from "./form-dispatcher/form-personal"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function FormDispatcher() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({

    user: {
      name: "",
      cpf: "",
      rg: "",
      date_birth: "",
      contact: "",
      email: "",
      password: "",
      confirm_password: ""
    },

    dispatcher: {
      regis_crdd: "",
      date_exp_regis: ""
    },

    office: {
      address: "",
      number: "",
      neighborhood: "",
      zip_code: "",
      city: "",
      state: "",
      contact: ""
    }

  })

  function handleChange(section: string, field: string, value: any) {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  async function handleSubmit(event: any) {
    event.preventDefault()

    if (formData.user.password !== formData.user.confirm_password) {
      alert("As senhas não coincidem!")
      return
    }


    const { confirm_password, ...userWithoutConfirm } = formData.user

    const dataToSend = {
      ...formData,
      user: userWithoutConfirm
    }

    const response = await fetch(
      "http://localhost:5000/api/dispatcher-system/dispatcher",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      }
    )

    if (response.ok) {
      alert("Despachante criado!")
      navigate("/")
    } else {
      alert("Erro ao criar despachante")
    }
  }

  return (
    <Main>
      <Form onSubmit={handleSubmit}>
        <Container>

          <FormPersonal
            user={formData.user}
            onChange={handleChange}
          />

          <FormCommercial
            dispatcher={formData.dispatcher}
            office={formData.office}
            onChange={handleChange}
          />

        </Container>

        <SubmitButton type="submit">Enviar</SubmitButton>

      </Form>
    </Main>
  )
}
