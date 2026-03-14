import { InlineFields } from "../../../layout/inline-fields-form"
import { InlineField } from "../../../layout/inline-field-form"
import SectionForm from "../../../layout/section-form"
import LabelForm from "../../../ui/label-form"
import InputForm from "../../../ui/input-form"
import TitleForm from "../../../ui/title-form"
import ButtonAppendForm from "../../../ui/button-append-form"
import FormSubmit from "../../../layout/form-submit"


export default function FormPersonal({ user, onChange }) {

  function handleUserChange(event) {
    const { name, value } = event.target
    onChange("user", name, value)
  }

  return (
    <SectionForm>
      <FormSubmit>
        <TitleForm title="Informações Pessoais" />

        <LabelForm title={"Nome Completo"} />
        <InputForm
          type="text"
          name="name"
          value={user.name}
          onChange={handleUserChange}
          placeholder="Digite seu nome completo"
        />

        <InlineFields>
          <InlineField>
            <LabelForm title={"CPF"} />
            <InputForm
              type="text"
              name="cpf"
              value={user.cpf}
              onChange={handleUserChange}
              placeholder="00000000000"
            />
          </InlineField>

          <InlineField>
            <LabelForm title={"RG"} />
            <InputForm
              type="text"
              name="rg"
              value={user.rg}
              onChange={handleUserChange}
              placeholder="Digite seu RG"
            />
          </InlineField>
        </InlineFields>

        <InlineFields>
          <InlineField>
            <LabelForm title={"Data de Nascimento"} />
            <InputForm
              type="date"
              name="date_birth"
              value={user.date_birth}
              onChange={handleUserChange}
              placeholder="dd/mm/yyyy"
            />
          </InlineField>

          <InlineField>
            <LabelForm title={"Telefone Pessoal"} />
            <InputForm
              type="text"
              name="contact"
              value={user.contact}
              onChange={handleUserChange}
              placeholder="(55) 9 9999-9999"
            />
          </InlineField>
        </InlineFields>

        <ButtonAppendForm title="Anexar Identidade" />

        <TitleForm title="Informações de Login" />

        <LabelForm title={"Email"} />
        <InputForm
          type="email"
          name="email"
          value={user.email}
          onChange={handleUserChange}
          placeholder=""
        />

        <InlineFields>
          <InlineField>
            <LabelForm title={"Senha"} />
            <InputForm
              type="password"
              name="password"
              value={user.password}
              onChange={handleUserChange}
              placeholder=""
            />
          </InlineField>

          <InlineField>
            <LabelForm title={"Confirmar Senha"} />
            <InputForm
              type="password"
              name="confirm_password"
              value={user.confirm_password}
              onChange={handleUserChange}
              placeholder=""
            />
          </InlineField>
        </InlineFields>
      </FormSubmit>
    </SectionForm>
  )
}
