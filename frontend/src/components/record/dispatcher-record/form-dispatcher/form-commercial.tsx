import {Section, Title, Input, Label, Button, InlineFields, InlineField} from "./form-dispatcher.styles"

export default function FormCommercial() {
  return (
    <Section>

      <Title>Informações Despachante</Title>

      <Label>Registro de CRDD</Label>
      <Input type="text" name="regis_crdd"/>

      <Label>Data de Expiração</Label>
      <Input type="date" name="data_exp_regis"/>

      <Button type="button">
        Anexar Registro
      </Button>

      <Title>Endereço do Comércio</Title>

      <InlineFields>
        <InlineField>
          <Label>Endereço</Label>
          <Input type="text" name="endereco_desp"/>
        </InlineField>

        <InlineField>
          <Label>Número do Local</Label>
          <Input type="number" name="num_desp"/>
        </InlineField>
      </InlineFields>

      <InlineFields>
        <InlineField>
          <Label>Bairro</Label>
          <Input type="text" name="bairro_desp"/>
        </InlineField>

        <InlineField>
          <Label>CEP</Label>
          <Input type="text" name="cep_desp"/>
        </InlineField>
      </InlineFields>

      <InlineFields>
        <InlineField>
          <Label>Cidade</Label>
          <Input type="text" name="cidade_desp"/>
        </InlineField>

        <InlineField>
          <Label>Estado</Label>
          <Input type="text" name="estado_desp"/>
        </InlineField>
      </InlineFields>

    </Section>
  )
}
