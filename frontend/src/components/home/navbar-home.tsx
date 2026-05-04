import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Realiza o scroll suave (rolagem) até uma seção específica da página.
 * @param {string} id - O ID do elemento de destino (ex: 'about-section').
 */
const handleScroll = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth", // Define a animação de rolagem como suave
      block: "start",    // Alinha o topo do elemento com o topo da viewport
    });
  }
};

/**
 * Componente de Navegação Principal.
 * Possui suporte a layout responsivo com menu "hambúrguer" para dispositivos móveis.
 */
export default function NavbarHome() {
  // Estado para controlar se o menu mobile está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);

  // Estilização compartilhada dos itens de navegação
  // block no mobile para ocupar a linha toda, md:inline-block no desktop
  const navItemStyles = cn(
    "text-white text-base font-medium px-4 py-1.5 rounded-lg transition-all",
    "hover:bg-white/10 cursor-pointer block md:inline-block"
  );

  /**
   * Alterna o estado do menu suspenso entre aberto e fechado.
   */
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full h-[60px] bg-[#21314D] text-white flex items-center justify-between px-4 md:px-6 shadow-md sticky top-0 z-50">

      {/* Container da Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center font-extrabold text-lg">
          D
        </div>
        <span className="font-semibold text-lg tracking-tight">Dispatcher</span>
      </div>

      {/* Navegação e Ações */}
      <div className="flex items-center gap-4">

        {/* Menu Desktop: visível apenas em telas médias (md) ou superiores */}
        <nav className="hidden md:flex items-center gap-1">
          <button onClick={() => handleScroll("carousel-section")} className={navItemStyles}>
            Funcionalidades
          </button>
          <button onClick={() => handleScroll("about-section")} className={navItemStyles}>
            Sobre
          </button>
        </nav>

        {/* Área de Botões (Login/Cadastro) */}
        <div className="flex items-center gap-2 border-l border-white/15 pl-3">
          <Link to="/login" className="px-3 py-1.5 bg-white text-[#21314D] font-semibold text-xs md:text-sm rounded-lg">
            Login
          </Link>
          {/* Oculta o botão 'Cadastrar' em telas muito pequenas (sm) para evitar quebra de layout */}
          <Link to="/register/client" className="hidden sm:block px-3 py-1.5 bg-[#3E5879] text-white font-semibold text-xs md:text-sm rounded-lg">
            Cadastrar
          </Link>
        </div>

        {/* Botão de Menu Mobile: visível apenas em telas menores que 'md' */}
        <button className="md:hidden p-1 transition-colors hover:text-white/70" onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Dropdown Mobile: Renderizado condicionalmente quando isOpen é true */}
      {isOpen && (
        <div className="absolute top-[60px] left-0 w-full bg-[#21314D] border-t border-white/10 p-4 flex flex-col gap-4 md:hidden animate-in slide-in-from-top duration-300">
          <button
            onClick={() => { handleScroll("carousel-section"); setIsOpen(false); }}
            className="text-left py-2 border-b border-white/5 text-white/90"
          >
            Funcionalidades
          </button>
          <button
            onClick={() => { handleScroll("about-section"); setIsOpen(false); }}
            className="text-left py-2 border-b border-white/5 text-white/90"
          >
            Sobre
          </button>
          {/* Link extra apenas para mobile para facilitar o acesso ao cadastro */}
          <Link to="/register/client" className="py-2 text-[#D8C4B6]" onClick={() => setIsOpen(false)}>
            Criar nova conta
          </Link>
        </div>
      )}
    </header>
  );
}
