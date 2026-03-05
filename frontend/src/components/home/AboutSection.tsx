import styled from "styled-components"

const Section = styled.section`
  display: flex;
  justify-content: center;
  padding: 50px;
  background-color: #D8C4B6;
`

const Content = styled.div`
  width: 70%;
  padding: 50px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
`

const Title = styled.h1`
  font-size: 50px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`

const Text = styled.p`
  font-size: 20px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 15px;
`

export default function AboutSection() {
  return (
    <Section>
        <Content>
            <Title>Sobre Nós</Title>
            <Text>
                Somos uma plataforma web desenvolvida especialmente para modernizar e centralizar os serviços oferecidos por despachantes de trânsito. Nosso objetivo é conectar clientes a profissionais qualificados de forma prática, segura e eficiente, eliminando a necessidade de múltiplos canais de comunicação e facilitando todo o processo — da solicitação à conclusão dos serviços.
            </Text>
            <Text>
                Com uma interface intuitiva e funcionalidades completas, permitimos que clientes encontrem despachantes em sua cidade, visualizem serviços disponíveis, saibam exatamente quais documentos são necessários e acompanhem o andamento de seus chamados em tempo real. Para os despachantes, oferecemos uma solução robusta para gerenciar perfis, serviços e agendamentos, otimizando sua rotina e ampliando sua visibilidade no mercado.
            </Text>
        </Content>
    </Section>
  );
}

