function FormPersonal() {
    return (
        <section className="info-pessoais">
            <h3>Informações Pessoais</h3>
            <label>Nome Completo</label>
            <input type="text" name="nome_desp" placeholder="Digite seu nome" required/>
            <div className="inline-fields">
                <div>
                    <label>CPF</label>
                    <input type="text" name="cpf_desp" placeholder="00000000000" required/>
                </div>
                <div>
                    <label>RG</label>
                    <input type="text" name="rg_desp" placeholder="Digite seu RG" required/>
                </div>
            </div>

            <label>Data de Nascimento</label>
            <input type="date" name="nasc_desp" required/>
            <button>Anexar Identidade</button>
            
            <h3>Informações de Contato e Login</h3>
            <div className="inline-fields">
                <div>
                    <label>Telefone Pessoal</label>
                    <input type="text" name="tele_pessoal_desp" placeholder="(99) 99999-9999" required/>
                </div>
                <div>
                    <label>Telefone Comercial</label>
                    <input type="text" name="tele_comercial" placeholder="(99) 99999-9999" required/>
                </div>
            </div>
            <label>Email</label>
            <input type="email" name="email_desp" placeholder="Digite seu email" required/>
            <div className="inline-fields">
                <div>
                    <label>Senha</label>
                    <input type="password" name="senha_desp" placeholder="Digite sua senha" required/>
                </div>
                <div>
                    <label>Confirmar Senha</label>
                    <input type="password" name="senha_confir" placeholder="Confirme sua senha" required/>
                </div>
            </div>
        </section>
    );
}

function FormCommercial() {
    return (
        <section className="info-despachante">
            <h3>Informações Despachante</h3>

            <label>Registro de CRDD</label>
            <input type="text" name="regis_crdd" placeholder="Digite o registro" required/>

            <label>Data de Expiração</label>
            <input type="date" name="data_exp_regis" required/>
            <button>Anexar Registro</button>

            <h3>Endereço do Comércio</h3>
            <div className="inline-fields">
                <div>
                    <label>Endereço</label>
                    <input type="text" name="endereco_desp" placeholder="Digite o endereço"/>
                </div>
                <div>
                    <label>Número do Local</label>
                    <input type="number" name="num_desp" placeholder="Digite aqui o número" required/>
                </div>
            </div>
            <div className="inline-fields">
                <div>
                    <label>Bairro</label>
                    <input type="text" name="bairro_desp" placeholder="Digite o bairro"/>
                </div>
                <div>
                    <label>CEP</label>
                    <input type="text" name="cep_desp" placeholder="00000-000"/>
                </div>
            </div>
            <div className="inline-fields">
                <div>
                    <label>Cidade</label>
                    <input type="text" name="cidade_desp" placeholder="Digite a cidade"/>
                </div>
                <div>
                    <label>Estado (Sigla)</label>
                    <input type="text" name="estado_desp" placeholder="Digite o estado"/>
                </div>
            </div>
        </section>
    );
}


export default function FormDispatcher() {
    return (
        <main>
            <form>
                <div className="container">
                    <FormPersonal />
                    <FormCommercial />
                </div>
                <button type="submit" className="enviar">Enviar</button>
            </form>
        </main>
    );
}
