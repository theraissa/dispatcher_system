import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import Navbar from "../../components/ui/navbar-with-title"
import LabelForm from "../../components/ui/label-form"
import ButtonSubmitForm from "../../components/ui/button-submit-form"
import InputForm from "../../components/ui/input-form"
import SectionForm from "../../components/layout/section-form"
import FormSubmit from "../../components/layout/form-submit"

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
`

export default function Login() {

    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        password: ""
    })

    function handleChange(event) {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const dadosParaEnviar = {
            email: formData.email,
            password: formData.password
        }

        const response = await fetch(
            "http://localhost:5000/api/dispatcher-system/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosParaEnviar)
            }
        )

        if (response.ok) {
            navigate("/initial/search-dispatcher")
        } else {
            alert("Erro ao acessar o perfil usuário")
        }
    }

    return (
        <>
            <Navbar title="Login" />
            <Main>
                <SectionForm>
                    <FormSubmit onSubmit={handleSubmit}>
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
                        <ButtonSubmitForm title="Acessar" />
                    </FormSubmit>
                </SectionForm>
            </Main>
        </>
    )
}
