import {Section, Title, Input, Label, Button, InlineFields, InlineField} from "./form-dispatcher.styles"


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
    <Section>
      <Title>Informações Despachante</Title>

      <Label>Registro CRDD</Label>
      <Input
        type="text"
        name="regis_crdd"
        value={dispatcher.regis_crdd}
        onChange={handleDispatcherChange}
      />
      
      <InlineFields>
        <InlineField>
          <Label>Data Expiração</Label>
          <Input
            type="date"
            name="date_exp_regis"
            value={dispatcher.date_exp_regis}
            onChange={handleDispatcherChange}
          />
        </InlineField>
        <InlineField>
        <Label>Telefone Comercial</Label>
        <Input 
          type="text" 
          name="contact"
          value={office.contact} 
          onChange={handleOfficeChange} 
        />
        </InlineField>
      </InlineFields>
      <Button type="button">Anexar Registro</Button>

      <Title>Endereço do Comércio</Title>

      <InlineFields>
        <InlineField>
         <Label>Endereço</Label>
          <Input
            type="text"
            name="address"
            value={office.address}
            onChange={handleOfficeChange}
          />
        </InlineField>

        <InlineField>
          <Label>Número</Label>
          <Input
            type="number"
            name="number"
            value={office.number}
            onChange={handleOfficeChange}
          />
        </InlineField>
      </InlineFields>

      <InlineFields>
        <InlineField>
          <Label>Bairro</Label>
          <Input
            type="text"
            name="neighborhood"
            value={office.neighborhood}
            onChange={handleOfficeChange}
          />
        </InlineField>
        <InlineField>
          <Label>CEP</Label>
          <Input
            type="text"
            name="zip_code"
            value={office.zip_code}
            onChange={handleOfficeChange}
          />
        </InlineField>
      </InlineFields>

      <InlineFields>
        <InlineField>
        <Label>Cidade</Label>
          <Input
            type="text"
            name="city"
            value={office.city}
            onChange={handleOfficeChange}
          />
        </InlineField>
        <InlineField>
          <Label>Estado</Label>
          <Input
            type="text"
            name="state"
            value={office.state}
            onChange={handleOfficeChange}
          />
        </InlineField>
      </InlineFields>
    </Section>
  )
}
