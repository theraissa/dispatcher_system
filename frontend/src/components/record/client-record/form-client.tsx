import { Card, CardContent } from "@/components/ui/card"
import InputPassword from "@/components/ui/input-password"
import { cpfMask } from "@/utils/masks"
import { CreditCard, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRegisterClient } from "../../../hooks/client/use-client-register"
import ButtonSubmitForm from "../ui/button-submit-form"
import InputForm from "../ui/input-form"
import LabelForm from "../ui/label-form"

export function FormClient() {
  const { register, error, loading } = useRegisterClient()

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirmar_senha: ""
  })

  useEffect(() => {
    if (error) {
      toast.error("Erro no cadastro", {
        description: error,
      })
    }
  }, [error])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (formData.password !== formData.confirmar_senha) {
      toast.warning("As senhas não coincidem!", {
        description: "Certifique-se de digitar a mesma senha em ambos os campos."
      })
      return
    }

    await register({
      name: formData.name,
      cpf: formData.cpf,
      email: formData.email,
      password: formData.password
    })
  }

  return (
    <Card className="w-full max-w-[600px] border-none shadow-sm 
      rounded-[24px] md:rounded-[40px] 
      p-4 md:p-8 bg-white">
      <CardContent className="p-2 md:p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 md:gap-4">

          {/* Nome */}
          <div className="space-y-1">
            <LabelForm title="Nome Completo" />
            <InputForm
              name="name"
              icon={<User size={18} />}
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
            />
          </div>

          {/* CPF */}
          <div className="space-y-1">
            <LabelForm title="CPF" />
            <InputForm
              name="cpf"
              icon={<CreditCard size={18} />}
              value={cpfMask(formData.cpf)}
              onChange={handleChange}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <LabelForm title="Email" />
            <InputForm
              type="email"
              name="email"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
            />
          </div>

          {/* Senhas em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <LabelForm title="Senha" />
              <InputPassword
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1">
              <LabelForm title="Confirmar Senha" />
              <InputPassword
                name="confirmar_senha"
                value={formData.confirmar_senha}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-center">
            <ButtonSubmitForm
              title="Cadastrar"
              loading={loading}
              className="w-full md:w-auto min-w-[200px]"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
