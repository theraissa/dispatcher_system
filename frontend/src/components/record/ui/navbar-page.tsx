import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-logout";

/**
 * Estrutura de um link de navegação da Navbar.
 */
type NavLink = {
  // Texto exibido no botão.
  label: string;
  // Rota de destino do link.
  path: string;
  // Ícone exibido ao lado do label.
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

/**
 * Props do componente NavbarPage.
 *
 * Responsável por renderizar a barra de navegação superior
 * com links dinâmicos e botão de logout.
 */
type NavbarPageProps = {
  // Título principal exibido na navbar.
  title: string;
  // Sigla ou título reduzido exibido no ícone da esquerda.
  shortTitle?: string;
  // Lista de links de navegação exibidos na navbar.
  links: NavLink[];
};

/**
 * Componente de barra de navegação superior.
 *
 * Responsável por:
 * - Exibir título da página
 * - Renderizar links de navegação
 * - Destacar rota ativa
 * - Permitir logout do usuário
 */
export default function NavbarPage({
  title,
  shortTitle = "P",
  links,
}: NavbarPageProps) {

  /**
   * Objeto que contém informações da rota atual.
   * Usado para destacar o link ativo na navbar.
   */
  const location = useLocation();

  // Hook responsável por realizar logout do usuário.
  const { logout } = useLogout();

  /**
   * Gera classes dinâmicas para os botões de navegação.
   *
   * @param isActive - indica se o link está ativo
   */
  const buttonStyles = (isActive: boolean) =>
    cn(
      "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200",
      isActive
        ? "bg-white text-[#21314D] shadow-sm scale-105"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    );

  return (
    <header className="w-full h-[60px] bg-[#21314D] text-white flex items-center justify-between px-6 shadow-md sticky top-0 z-50">

      {/* =========================
          LADO ESQUERDO (IDENTIDADE)
         ========================= */}
      <div className="flex items-center gap-3">

        {/* Ícone/sigla da aplicação */}
        <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center font-extrabold text-sm">
          {shortTitle}
        </div>

        {/* Título principal */}
        <span className="text-base font-bold tracking-tight hidden sm:block italic opacity-90">
          {title}
        </span>
      </div>

      {/* =========================
          NAVEGAÇÃO (LADO DIREITO)
         ========================= */}
      <nav className="flex items-center md:gap-2">

        {/* Links dinâmicos da aplicação */}
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={buttonStyles(isActive)}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />

              {/* Label visível apenas em telas maiores */}
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          );
        })}

        {/* =========================
            BOTÃO DE LOGOUT
           ========================= */}
        <button
          onClick={logout}
          className={cn(
            buttonStyles(true),
            "cursor-pointer bg-red-500/20 text-red-400 hover:bg-red-600/20 hover:text-red-500 ml-2"
          )}
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="hidden md:inline">Sair</span>
        </button>

      </nav>
    </header>
  );
}
