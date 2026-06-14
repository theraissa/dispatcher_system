import { isValidCPF } from "@/utils/masks"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRegisterDispatcher } from "../../../hooks/dispatcher/use-dispatcher-register"
import FormsContainer from "../../layout/form-container"
import FormSubmit from "../../layout/form-submit"
import ButtonSubmitForm from "../ui/button-submit-form"
import FormCommercial from "./form-dispatcher/form-commercial"
import FormPersonal from "./form-dispatcher/form-personal"

type FormSection = "user" | "dispatcher" | "address";


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
    address: {
      address: "",
      number: "",
      neighborhood: "",
      zip_code: "",
      city: "",
      state: "",
      contact: ""
    }
  })

  useEffect(() => {
    if (error) {
      toast.error("Erro no cadastro", {
        description: error,
      })
    }
  }, [error])

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
    event.preventDefault();

    // 1. Validação preventiva de Senhas
    if (formData.user.password !== formData.user.confirm_password) {
      toast.warning("As senhas não coincidem!", {
        description: "Certifique-se de digitar a mesma senha em ambos os campos."
      });
      return;
    }

    // 2. Validação centralizada do CPF
    if (!isValidCPF(formData.user.cpf)) {
      toast.warning("CPF Inválido!", {
        description: "Por favor, verifique os números digitados nas informações pessoais."
      });
      return;
    }
    register(formData);
  }

  return (
    <div className="w-full flex-1 flex flex-col py-10 md:py-18">
      <FormSubmit onSubmit={handleSubmit}>

        <FormsContainer>


          <FormPersonal
            user={formData.user}
            onChange={handleChange}
            readOnly={false}
            showPasswordFields={true}
          />

          <FormCommercial
            dispatcher={formData.dispatcher}
            address={formData.address}
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
