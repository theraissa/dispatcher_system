import styled from "styled-components"

const Section = styled.section`
  padding: 100px;
  background-color: #F5EFE7;
`

const Container = styled.div`
  display: flex;
  gap: 20px;
`

const Card = styled.div`
  flex: 0 0 450px;
  height: 500px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const Title = styled.h1`
  font-size: 25px;
  color: #333;
  margin-bottom: 30px;
`

const Text = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #666;
`

export default function CarouselSection() {
  return (
    <Section>
        <Container>
            <Card>
                <Title>1. Busca e Solicitação de Serviços</Title>
                <Text>Clientes podem pesquisar despachantes por nome ou município, acessar seus perfis, visualizar os serviços oferecidos e solicitar diretamente o atendimento desejado, com orientações claras sobre a documentação necessária.</Text>
            </Card>
            <Card>
                <Title>2. Gestão de Perfil e Serviços</Title>
                <Text>Despachantes têm controle total sobre seus perfis e serviços: podem cadastrar, editar e excluir atividades prestadas, informar documentos exigidos e acompanhar em tempo real os chamados recebidos, com acesso a uma agenda organizada por data e horário.</Text>
            </Card>
            <Card>
                <Title>3. Acompanhamento Chamados</Title>
                <Text>Tanto clientes quanto despachantes podem consultar o histórico e o status atual de cada solicitação — desde “Documentação Pendente” até “Serviço Completo” — garantindo transparência e comunicação eficiente durante todo o processo.</Text>
            </Card>
            <Card>
                <Title>4. Segurança e Validação</Title>
                <Text>O sistema valida a identidade de todos os usuários (clientes e despachantes) e exige autenticação em dois fatores no login, além de verificar periodicamente o registro profissional dos despachantes no CRDD. Todas as interações são protegidas por criptografia e notificações automáticas por e-mail.</Text>
            </Card>
        </Container>
    </Section>
  );
}

