export default function CarouselSection() {
  return (
    <section id="sessao-carrossel" className="sessao-carrossel">
        <div className="carrossel-container">
            <div className="carrossel-card">
                <h1 className="titulo-sessao">1. Busca e Solicitação de Serviços</h1>
                <p className="parag-sessao">Clientes podem pesquisar despachantes por nome ou município, acessar seus perfis, visualizar os serviços oferecidos e solicitar diretamente o atendimento desejado, com orientações claras sobre a documentação necessária.</p>
            </div>
            <div className="carrossel-card">
                <h1 className="titulo-sessao">2. Gestão de Perfil e Serviços</h1>
                <p className="parag-sessao">Despachantes têm controle total sobre seus perfis e serviços: podem cadastrar, editar e excluir atividades prestadas, informar documentos exigidos e acompanhar em tempo real os chamados recebidos, com acesso a uma agenda organizada por data e horário.</p>
            </div>
            <div className="carrossel-card">
                <h1 className="titulo-sessao">3. Acompanhamento Chamados</h1>
                <p className="parag-sessao">Tanto clientes quanto despachantes podem consultar o histórico e o status atual de cada solicitação — desde “Documentação Pendente” até “Serviço Completo” — garantindo transparência e comunicação eficiente durante todo o processo.</p>
            </div>
            <div className="carrossel-card">
                <h1 className="titulo-sessao">4. Segurança e Validação</h1>
                <p className="parag-sessao">O sistema valida a identidade de todos os usuários (clientes e despachantes) e exige autenticação em dois fatores no login, além de verificar periodicamente o registro profissional dos despachantes no CRDD. Todas as interações são protegidas por criptografia e notificações automáticas por e-mail.</p>
            </div>
        </div>
    </section>
  );
}

