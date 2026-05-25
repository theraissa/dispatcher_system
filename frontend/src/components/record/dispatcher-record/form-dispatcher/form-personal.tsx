import InputPassword from "@/components/ui/input-password";
import { Separator } from "@/components/ui/separator";
import type { CreateUserType } from "@/types/type";
import { cpfMask, phoneMask } from "@/utils/masks";
import { Calendar, CreditCard, Lock, Mail, Phone, User } from "lucide-react";
import InlineField from "../../../layout/inline-field-form";
import InlineFields from "../../../layout/inline-fields-form";
import SectionForm from "../../../layout/section-form";
import TitleTemplate from "../../../ui/title";
import InputForm from "../../ui/input-form";
import LabelForm from "../../ui/label-form";


type FormPersonalProps = {
  user: CreateUserType;
  onChange: (section: "user", field: any, value: string) => void;
  readOnly: boolean;
  showPasswordFields?: boolean;
}


export default function FormPersonal({ user, onChange, readOnly, showPasswordFields = false }: FormPersonalProps) {

  function handleUserChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    onChange("user", name, value)
  }

  return (

    <SectionForm>
      <TitleTemplate title="Informações Pessoais" />

      <LabelForm title="Nome Completo" />
      <InputForm
        name="name"
        icon={<User size={18} />}
        value={user.name}
        onChange={handleUserChange}
        placeholder="Digite seu nome completo"
        readOnly={readOnly}
      />

      <InlineFields>
        <InlineField>
          <LabelForm title="CPF" />
          <InputForm
            name="cpf"
            icon={<CreditCard size={18} />}
            value={cpfMask(user.cpf)}
            onChange={handleUserChange}
            placeholder="000.000.000-00"
            readOnly={readOnly}
          />
        </InlineField>
      </InlineFields>

      <InlineFields>
        <InlineField>
          <LabelForm title="Data de Nascimento" />
          <InputForm
            type="date"
            name="date_birth"
            icon={<Calendar size={18} />}
            value={user.date_birth}
            onChange={handleUserChange}
            readOnly={readOnly}
          />
        </InlineField>

        <InlineField>
          <LabelForm title="Telefone Pessoal" />
          <InputForm
            name="contact"
            icon={<Phone size={18} />}
            value={phoneMask(user.contact)}
            onChange={handleUserChange}
            placeholder="(55) 9 9999-9999"
            readOnly={readOnly}
          />
        </InlineField>
      </InlineFields>

      <Separator className="my-8 opacity-100" />

      <TitleTemplate title="Informações de Login" />

      <div>
        <LabelForm title="Email" />
        <InputForm
          type="email"
          name="email"
          icon={<Mail size={18} />}
          value={user.email}
          onChange={handleUserChange}
          readOnly={readOnly}
        />
      </div>

      {showPasswordFields && (
        <InlineFields>
          <InlineField>
            <LabelForm title="Senha" />
            <InputPassword
              name="password"
              icon={<Lock size={18} />}
              value={user.password}
              onChange={handleUserChange}
              readOnly={readOnly}
            />
          </InlineField>

          <InlineField>
            <LabelForm title="Confirmar Senha" />
            <InputPassword
              name="confirm_password"
              icon={<Lock size={18} />}
              value={user.confirm_password}
              onChange={handleUserChange}
              readOnly={readOnly}
            />
          </InlineField>
        </InlineFields>
      )}
      {!showPasswordFields && (
        <Separator className="my-11 opacity-0" />
      )}

    </SectionForm>
  )
}
