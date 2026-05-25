import { Link } from "react-router-dom";

/**
 * Componente de Rodapé (Footer).
 * Organiza links úteis, informações de contato e créditos.
 */
export default function Footer() {

  // Classes utilitárias para manter a consistência e reduzir repetição
  const linkStyles = "text-zinc-500 hover:text-[#21314D] transition-colors text-sm";
  const titleStyles = "text-[#1E1E1E] text-sm font-bold uppercase tracking-wider mb-4";

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 pt-12 md:pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* Coluna 1: Área do Profissional */}
          {/* <div className="flex flex-col">
            <h4 className={titleStyles}>Despachante</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register/dispatcher" className={linkStyles}>
                  Crie seu Usuário
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Coluna 2: Acesso Administrativo */}
          {/* <div className="flex flex-col">
            <h4 className={titleStyles}>Gestão</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/admin" className={linkStyles}>
                  Acessar Painel Admin
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Coluna 3: Ajuda e Documentação */}
          <div className="flex flex-col">
            <h4 className={titleStyles}>Suporte</h4>
            <ul className="space-y-2">
              <li><Link to="#" className={linkStyles}>Guia de Uso</Link></li>
              <li><Link to="#" className={linkStyles}>Documentação</Link></li>
              <li><Link to="#" className={linkStyles}>Privacidade</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Informações de Contato */}
          <div className="flex flex-col">
            <h4 className={titleStyles}>Contato</h4>
            <ul className="space-y-2">
              <li className="text-zinc-500 text-sm break-all italic">
                info@dispatcher.com
              </li>
              <li className="text-zinc-500 text-sm font-medium">
                (51) 99999-9999
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-zinc-200 text-center">
          <p className="text-xs text-zinc-400 font-medium">
            © {new Date().getFullYear()} Dispatcher System. Desenvolvido para o IFRS.
          </p>
        </div>
      </div>
    </footer>
  );
}
