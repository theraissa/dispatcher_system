import InlineField from "../../../layout/inline-field-form"
import InlineFields from "../../../layout/inline-fields-form"
import SectionForm from "../../../layout/section-form"
import LabelForm from "../../ui/label-form"
import InputForm from "../../ui/input-form"
import ButtonAppendForm from "../../ui/button-append-form"
import TitleTemplate from "../../../ui/title"
import {
  Briefcase,
  Calendar,
  Phone,
  MapPin,
  Hash,
  Navigation,
  Globe,
  Milestone
} from "lucide-react";

export default function FormCommercial({ dispatcher, office, onChange, readOnly }) {

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
      <TitleTemplate title="Informações Despachante" />

      <LabelForm title="Registro CRDD" />
      <InputForm
        name="regis_crdd"
        icon={<Briefcase size={18} />}
        value={dispatcher.regis_crdd}
        onChange={handleDispatcherChange}
        placeholder="CRDD/[Estado] nº XXXXX"
        readOnly={readOnly}
      />

      <InlineFields>
        <InlineField>
          <LabelForm title="Data Expiração" />
          <InputForm
            type="date"
            name="date_exp_regis"
            icon={<Calendar size={18} />}
            value={dispatcher.date_exp_regis}
            onChange={handleDispatcherChange}
            readOnly={readOnly}
          />
        </InlineField>

        <InlineField>
          <LabelForm title="Telefone Comercial" />
          <InputForm
            name="contact"
            icon={<Phone size={18} />}
            value={office.contact}
            onChange={handleOfficeChange}
            placeholder="(55) 9 9999-9999"
            readOnly={readOnly}
          />
        </InlineField>
      </InlineFields>

      <ButtonAppendForm title="Anexar Registro CRDD" />

      <hr className="border-zinc-100 my-6" />

      <TitleTemplate title="Endereço do Comércio" />

      <InlineFields>
        <InlineField>
          <LabelForm title="Endereço" />
          <InputForm
            name="address"
            icon={<MapPin size={18} />}
            value={office.address}
            onChange={handleOfficeChange}
            placeholder="Rua, Avenida..."
            readOnly={readOnly}
          />
        </InlineField>

        <InlineField className="md:flex-[0.4]"> {/* Número pode ser menor */}
          <LabelForm title="Número" />
          <InputForm
            type="text"
            name="number"
            icon={<Hash size={18} />}
            value={office.number}
            onChange={handleOfficeChange}
            placeholder="123"
            readOnly={readOnly}
          />
        </InlineField>
      </InlineFields>

      <InlineFields>
        <InlineField>
          <LabelForm title="Bairro" />
          <InputForm
            name="neighborhood"
            icon={<Navigation size={18} />}
            value={office.neighborhood}
            onChange={handleOfficeChange}
            placeholder="Bairro"
            readOnly={readOnly}
          />
        </InlineField>
        <InlineField>
          <LabelForm title="CEP" />
          <InputForm
            name="zip_code"
            icon={<Milestone size={18} />}
            value={office.zip_code}
            onChange={handleOfficeChange}
            placeholder="00000-000"
            readOnly={readOnly}
          />
        </InlineField>
      </InlineFields>

      <InlineFields>
        <InlineField>
          <LabelForm title="Cidade" />
          <InputForm
            name="city"
            icon={<Globe size={18} />}
            value={office.city}
            onChange={handleOfficeChange}
            placeholder="Cidade"
            readOnly={readOnly}
          />
        </InlineField>
        <InlineField className="md:flex-[0.4]">
          <LabelForm title="Estado" />
          <InputForm
            name="state"
            value={office.state}
            onChange={handleOfficeChange}
            placeholder="UF"
            readOnly={readOnly}
            maxLength={2}
          />
        </InlineField>
      </InlineFields>
    </SectionForm>
  )
}
