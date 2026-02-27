export default function FormClient() {
  return (
    <section className="form-cadastro-cliente">
        <form method="POST">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome-cliente" required placeholder="Digite seu nome completo"/>
            
            <label htmlFor="nome">CPF</label>
            <input type="text" id="cpf-cliente" name="cpf-cliente" required placeholder="Digite seu CPF"/>

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email-cliente" required placeholder="Digite seu email"/>
            
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" name="senha-cliente" required placeholder="Digite sua senha"/>
            
            <label htmlFor="confirmar-senha">Confirmar Senha</label>
            <input type="password" id="confirmar-senha" name="confirmar-senha" required placeholder="Confirme sua senha"/>
            
            <button type="submit">Cadastrar</button>
        </form>
    </section>
  );
}
