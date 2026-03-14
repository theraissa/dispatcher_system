import { InlineFields } from "../../../layout/inline-fields-form"
import { InlineField } from "../../../layout/inline-field-form"
import InputForm from "../../../ui/input-form"
import LabelForm from "../../../ui/label-form"
import SectionForm from "../../../layout/section-form"
import TitleForm from "../../../ui/title-form"
import ButtonAppendForm from "../../../ui/button-append-form"
import FormSubmit from "../../../layout/form-submit"


export default function FormCommercial({ dispatcher, office, onChange }) {

  function handleDispatcherChange(event) {
    const { name, value } = event.target
    onChange("dispatcher", name, value)
  }

  function handleOfficeChange(event) {
    const { name, value } = event.target
    onChange("office", name, value)
  }

  return (
    <SectionForm>
      <FormSubmit>
        <TitleForm title="Informações Despachante" />

        <LabelForm title={"Registro CRDD"} />
        <InputForm
          type="text"
          name="regis_crdd"
          value={dispatcher.regis_crdd}
          onChange={handleDispatcherChange}
          placeholder={"CRDD/[Estado] nº XXXXX"}
        />

        <InlineFields>

          <InlineField>
            <LabelForm title={"Data Expiração"} />
            <InputForm
              type="date"
              name="date_exp_regis"
              value={dispatcher.date_exp_regis}
              onChange={handleDispatcherChange}
              placeholder={"dd/mm/yyyy"}
            />
          </InlineField>

          <InlineField>
            <LabelForm title={"Telefone Comercial"} />
            <InputForm
              type="text"
              name="contact"
              value={office.contact}
              onChange={handleOfficeChange}
              placeholder={"(55) 9 9999-9999"}
            />
          </InlineField>

        </InlineFields>

        <ButtonAppendForm title="Anexar Registro" />

        <TitleForm title="Endereço do Comércio" />

        <InlineFields>
          <InlineField>
            <LabelForm title={"Endereço"} />
            <InputForm
              type="text"
              name="address"
              value={office.address}
              onChange={handleOfficeChange}
              placeholder={""}
            />
          </InlineField>

          <InlineField>
            <LabelForm title={"Número"} />
            <InputForm
              type="number"
              name="number"
              value={office.number}
              onChange={handleOfficeChange}
              placeholder={""}
            />
          </InlineField>
        </InlineFields>

        <InlineFields>
          <InlineField>
            <LabelForm title={"Bairro"} />
            <InputForm
              type="text"
              name="neighborhood"
              value={office.neighborhood}
              onChange={handleOfficeChange}
              placeholder={""}
            />
          </InlineField>
          <InlineField>
            <LabelForm title={"CEP"} />
            <InputForm
              type="text"
              name="zip_code"
              value={office.zip_code}
              onChange={handleOfficeChange}
              placeholder={""}
            />
          </InlineField>
        </InlineFields>

        <InlineFields>
          <InlineField>
            <LabelForm title={"Cidade"} />
            <InputForm
              type="text"
              name="city"
              value={office.city}
              onChange={handleOfficeChange}
              placeholder={""}

            />
          </InlineField>
          <InlineField>
            <LabelForm title={"Estado"} />
            <InputForm
              type="text"
              name="state"
              value={office.state}
              onChange={handleOfficeChange}
              placeholder={""}
            />
          </InlineField>
        </InlineFields>
      </FormSubmit>
    </SectionForm>
  )
}
