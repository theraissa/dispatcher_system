import { Separator } from "@/components/ui/separator"
import type { CreateDispatcher, CreateOffice } from "@/types/type"
import { ESTADOS_BR } from "@/utils/constants"
import { phoneMask, zipCodeMask } from "@/utils/masks"
import {
  Briefcase,
  Calendar,
  Hash,
  MapPin,
  Milestone,
  Navigation,
  Phone
} from "lucide-react"
import { useEffect, useState } from "react"
import InlineField from "../../../layout/inline-field-form"
import InlineFields from "../../../layout/inline-fields-form"
import SectionForm from "../../../layout/section-form"
import TitleTemplate from "../../../ui/title"
import { CommandForm } from "../../ui/command-form"
import InputForm from "../../ui/input-form"
import LabelForm from "../../ui/label-form"


type FormCommercialProps = {
  dispatcher: CreateDispatcher;
  office: CreateOffice;
  onChange: (section: "dispatcher" | "office", field: any, value: string) => void;
  readOnly: boolean;
};


export default function FormCommercial({ dispatcher, office, onChange, readOnly }: FormCommercialProps) {

  function handleDispatcherChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    onChange("dispatcher", name, value)
  }

  function handleOfficeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    onChange("office", name, value)
  }

  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Efeito que dispara sempre que o estado (UF) mudar
  useEffect(() => {
    if (!office.state) {
      setCities([]);
      return;
    }

    async function fetchCities() {
      setLoadingCities(true);
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${office.state}/municipios?orderBy=nome`
        );
        const data = await response.json();

        const formattedCities = data.map((city: any) => ({
          value: city.nome,
          label: city.nome,
        }));

        setCities(formattedCities);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      } finally {
        setLoadingCities(false);
      }
    }

    fetchCities();
  }, [office.state]); // Monitora o estado

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
            value={phoneMask(office.contact)}
            onChange={handleOfficeChange}
            placeholder="(55) 9 9999-9999"
            readOnly={readOnly}
          />
        </InlineField>
      </InlineFields>

      <Separator className="my-8 opacity-100" />

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
            value={zipCodeMask(office.zip_code)}
            onChange={handleOfficeChange}
            placeholder="00000-000"
            readOnly={readOnly}
          />
        </InlineField>
      </InlineFields>

      <InlineFields>
        <InlineField className="md:flex-[0.4]">
          <LabelForm title="Estado" />
          <CommandForm
            type="state"
            options={ESTADOS_BR} // Aquela lista estática que criamos
            value={office.state || ""}
            placeholder="UF"
            disabled={readOnly}
            onChange={(val) => {
              // Atualiza o estado
              handleOfficeChange({ target: { name: "state", value: val } } as any)
              // Limpa a cidade selecionada anteriormente
              onChange("office", "city", "")
            }}
          />
        </InlineField>

        <InlineField>
          <LabelForm title="Cidade" />
          <CommandForm
            type="city"
            options={cities} // Cidades vindas da API do IBGE (via useEffect)
            value={office.city || ""}
            placeholder={loadingCities ? "Carregando..." : "Selecione a cidade"}
            disabled={readOnly || !office.state || loadingCities}
            onChange={(val) =>
              handleOfficeChange({ target: { name: "city", value: val } } as any)
            }
          />
        </InlineField>
      </InlineFields>
    </SectionForm>
  )
}
