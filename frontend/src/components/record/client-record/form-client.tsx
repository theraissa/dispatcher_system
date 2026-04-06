import { useState } from "react"
import { useRegisterUser } from "../../../hooks/use-register-user"
import { Card, CardContent } from "@/components/ui/card"
import { User, CreditCard, Mail, Lock } from "lucide-react"
import InputForm from "../ui/input-form"
import LabelForm from "../ui/label-form"
import ButtonSubmitForm from "../ui/button-submit-form"
import { useNavigate } from "react-router-dom"
import { FRONTEND_ROUTES } from "@/routes/frontend-routes"

export function FormClient() {
  const { register, error, loading } = useRegisterUser()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirmar_senha: ""
  })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (formData.password !== formData.confirmar_senha) {
      alert("As senhas não coincidem!")
      return
    }

    try {
      await register({
        name: formData.name,
        cpf: formData.cpf,
        email: formData.email,
        password: formData.password
      })

      navigate(FRONTEND_ROUTES.LOGIN, {
        state: { email: formData.email }
      })

    } catch (err) {
      console.error("Erro ao registrar usuário:", err)
    }
  }

  return (
    <Card className="w-full max-w-[600px] border-none shadow-sm rounded-[40px] p-8">
      <CardContent>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

          {/* Nome */}
          <div className="space-y-1">
            <LabelForm title="Nome Completo" />
            <div className="relative">
              <InputForm
                type="text"
                name="name"
                icon={<User size={18} />}
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                readOnly={false}
              />
            </div>

          </div>

          {/* CPF */}
          <div className="space-y-1">
            <LabelForm title="CPF" />
            <div className="relative">
              <InputForm
                type="text"
                name="cpf"
                icon={<CreditCard size={18} />}
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className="pl-10 h-11 bg-white rounded-xl border-zinc-200"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <LabelForm title="Email" />
            <div className="relative">
              <InputForm
                type="email"
                name="email"
                icon={<Mail size={18} />}
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                readOnly={false}
              />
            </div>
          </div>

          {/* Senhas em Grid para economizar espaço vertical */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <LabelForm title="Senha" />
              <div className="relative">
                <InputForm
                  type="password"
                  name="password"
                  icon={<Lock size={18} />}
                  value={formData.password}
                  onChange={handleChange}
                  readOnly={false}
                />
              </div>
            </div>

            <div className="space-y-1">
              <LabelForm title="Confirmar Senha" />
              <InputForm
                type="password"
                name="confirmar_senha"
                value={formData.confirmar_senha}
                onChange={handleChange}
                className="h-11 bg-white rounded-xl border-zinc-200"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-center">
            <ButtonSubmitForm
              title="Cadastrar"
              loading={loading}
            />
          </div>

        </form>
      </CardContent>
    </Card>
  )
}
