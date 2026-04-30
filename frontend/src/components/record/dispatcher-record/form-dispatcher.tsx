import { useState } from "react"
import { useRegisterDispatcher } from "../../../hooks/use-register-dispatcher"
import FormsContainer from "../../layout/form-container"
import FormSubmit from "../../layout/form-submit"
import ButtonSubmitForm from "../ui/button-submit-form"
import FormCommercial from "./form-dispatcher/form-commercial"
import FormPersonal from "./form-dispatcher/form-personal"

type FormSection = "user" | "dispatcher" | "office";


export default function FormDispatcher() {
  const { register, error, loading } = useRegisterDispatcher()

  const [formData, setFormData] = useState({
    user: {
      name: "",
      cpf: "",
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

  function handleChange(section: FormSection, field: string, value: string) {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    register(formData)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EDE2]">

      <FormSubmit onSubmit={handleSubmit}>
        {error && <span style={{ color: "red" }}>{error}</span>}

        <FormsContainer>
          <FormPersonal
            user={formData.user}
            onChange={handleChange}
            readOnly={false}
          />

          <FormCommercial
            dispatcher={formData.dispatcher}
            office={formData.office}
            onChange={handleChange}
            readOnly={false}
          />
        </FormsContainer>

        <ButtonSubmitForm
          title={loading ? "Cadastrando..." : "Cadastrar"}
        />
      </FormSubmit>
    </div>

  )
}
