import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import Navbar from "../../components/record/ui/navbar-with-title"
import LabelForm from "../../components/record/ui/label-form"
import ButtonSubmitForm from "../../components/record/ui/button-submit-form"
import InputForm from "../../components/record/ui/input-form"
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
    const [errorMessage, setErrorMessage] = useState("")

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

        try {
            const response = await fetch(
                "http://localhost:5000/api/dispatcher-system/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            )

            const data = await response.json()

            if (!response.ok) {
                // pega mensagem correta do backend
                const message =
                    data.description ||
                    data.message ||
                    "Erro ao fazer login"

                throw new Error(message)
            }

            localStorage.setItem("user", JSON.stringify(data))

            if (data.role === "dispatcher") {
                navigate("/initial/dispatcher/profile")
            } else {
                navigate("/initial/search-dispatcher")
            }

        } catch (error) {
            console.error(error)
            setErrorMessage(error.message)
        }
    }
    return (
        <>
            <Navbar title="Login" />
            <Main>
                <SectionForm>
                    {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
                    <FormSubmit onSubmit={handleSubmit}>
                        <LabelForm title="Email" />
                        <InputForm
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Digite seu email"
                            readOnly={false}
                        />

                        <LabelForm title="Senha" />
                        <InputForm
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                            readOnly={false}
                        />
                        <ButtonSubmitForm title="Acessar" />
                    </FormSubmit>
                </SectionForm>
            </Main>
        </>
    )
}
