import InlineField from "../../../layout/inline-field-form"
import InlineFields from "../../../layout/inline-fields-form"
import SectionForm from "../../../layout/section-form"
import LabelForm from "../../ui/label-form"
import InputForm from "../../ui/input-form"
import ButtonAppendForm from "../../ui/button-append-form"
import TitleTemplate from "../../../ui/title"
import { User, CreditCard, Fingerprint, Calendar, Phone, Mail, Lock } from "lucide-react";

export default function FormPersonal({ user, onChange, readOnly }) {

  function handleUserChange(event) {
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
            value={user.cpf}
            onChange={handleUserChange}
            placeholder="000.000.000-00"
            readOnly={readOnly}
          />
        </InlineField>

        <InlineField>
          <LabelForm title="RG" />
          <InputForm
            name="rg"
            icon={<Fingerprint size={18} />}
            value={user.rg}
            onChange={handleUserChange}
            placeholder="Digite seu RG"
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
            value={user.contact}
            onChange={handleUserChange}
            placeholder="(55) 9 9999-9999"
            readOnly={readOnly}
          />
        </InlineField>
      </InlineFields>

      <ButtonAppendForm title="Anexar Identidade" />

      <hr className="border-zinc-100 my-6" /> {/* Linha sutil de separação */}

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

      <InlineFields>
        <InlineField>
          <LabelForm title="Senha" />
          <InputForm
            type="password"
            name="password"
            icon={<Lock size={18} />}
            value={user.password}
            onChange={handleUserChange}
            readOnly={readOnly}
          />
        </InlineField>

        <InlineField>
          <LabelForm title="Confirmar Senha" />
          <InputForm
            type="password"
            name="confirm_password"
            icon={<Lock size={18} />}
            value={user.confirm_password}
            onChange={handleUserChange}
            readOnly={readOnly}
          />
        </InlineField>
      </InlineFields>
    </SectionForm>
  )
}
