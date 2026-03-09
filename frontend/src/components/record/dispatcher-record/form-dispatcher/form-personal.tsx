import {Section,Title, Input, Label, Button, InlineFields, InlineField} from "./form-dispatcher.styles"


export default function FormPersonal({ user, onChange }) {

  function handleUserChange(event) {
    const { name, value } = event.target
    onChange("user", name, value)
  }

  return (
    <Section>

      <Title>Informações Pessoais</Title>

      <Label>Nome Completo</Label>
      <Input
        type="text"
        name="name"
        value={user.name}
        onChange={handleUserChange}
        placeholder="Digite seu nome completo"
      />

      <InlineFields>
        <InlineField>
          <Label>CPF</Label>
          <Input
            type="text"
            name="cpf"
            value={user.cpf}
            onChange={handleUserChange}
            placeholder="00000000000"
          />
        </InlineField>

        <InlineField>
          <Label>RG</Label>
          <Input 
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
          <Label>Data de Nascimento</Label>
          <Input 
            type="date" 
            name="date_birth"  
            value={user.date_birth} 
            onChange={handleUserChange} 
          />
        </InlineField>

        <InlineField>
          <Label>Telefone Pessoal</Label>
          <Input 
            type="text" 
            name="contact"
            value={user.contact} 
            onChange={handleUserChange} 
          />
        </InlineField>
      </InlineFields>
      <Button type="button">Anexar Identidade</Button>

      <Title>Informações de Login</Title>

      <Label>Email</Label>
      <Input 
        type="email" 
        name="email"
        value={user.email} 
        onChange={handleUserChange} 
      />

      <InlineFields>
        <InlineField>
          <Label>Senha</Label>
          <Input 
            type="password" 
            name="password"
            value={user.password} 
            onChange={handleUserChange} 
          />
        </InlineField>

        <InlineField>
          <Label>Confirmar Senha</Label>
          <Input 
            type="password" 
            name="confirm_password"
            value={user.confirm_password} 
            onChange={handleUserChange} 
          />
        </InlineField>
      </InlineFields>

    </Section>
  )
}
