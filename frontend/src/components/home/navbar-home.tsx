import { cn } from "@/lib/utils";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { Briefcase, ChevronDown, Menu, User, Workflow, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Fecha o dropdown se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRegisterMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-[60px] bg-[#21314D] text-white flex items-center justify-between px-4 md:px-6 shadow-md sticky top-0 z-50">

      {/* Container da Logo */}
      <Link
        to={FRONTEND_ROUTES.HOME}
        className="flex items-center gap-2.5 group cursor-pointer select-none"
      >
        {/* Box do Ícone */}
        <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center font-extrabold text-lg border border-white/5 shadow-inner transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105">
          {/* Ícone representando os processos conectados do despachante */}
          <Workflow className="w-4 h-4 text-white transition-transform duration-500 group-hover:rotate-12" />
        </div>

        {/* Nome da Aplicação */}
        <span className="font-bold text-lg tracking-tight transition-colors group-hover:text-zinc-200">
          Conecta Despachante
        </span>
      </Link>

      {/* Navegação e Ações */}
      <div className="flex items-center gap-4">

        {/* Menu Desktop */}
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
          <Link to="/login" className="px-3 py-1.5 bg-white text-[#21314D] font-semibold text-xs md:text-sm rounded-lg hover:bg-zinc-100 transition-colors">
            Login
          </Link>

          {/* BOTÃO CADASTRAR COM DROPDOWN (DESKTOP) */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              onClick={() => setShowRegisterMenu(!showRegisterMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3E5879] text-white font-semibold text-xs md:text-sm rounded-lg hover:bg-[#344a66] transition-all cursor-pointer"
            >
              Cadastrar
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showRegisterMenu && "rotate-180")} />
            </button>

            {/* Menu Suspenso de Opções */}
            {showRegisterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 py-1.5 z-50 text-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link
                  to={FRONTEND_ROUTES.REGISTER.CLIENT}
                  onClick={() => setShowRegisterMenu(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-medium hover:bg-zinc-50 transition-colors"
                >
                  <User className="w-4 h-4 text-[#21314D]" />
                  Cliente
                </Link>
                <Link
                  to={FRONTEND_ROUTES.REGISTER.DISPATCHER}
                  onClick={() => setShowRegisterMenu(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-medium hover:bg-zinc-50 border-t border-zinc-100 transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-[#3E5879]" />
                  Despachante
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Botão de Menu Mobile */}
        <button className="md:hidden p-1 transition-colors hover:text-white/70" onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Dropdown Mobile */}
      {isOpen && (
        <div className="absolute top-[60px] left-0 w-full bg-[#21314D] border-t border-white/10 p-4 flex flex-col gap-2 md:hidden animate-in slide-in-from-top duration-300">
          <button
            onClick={() => { handleScroll("carousel-section"); setIsOpen(false); }}
            className="text-left py-2.5 border-b border-white/5 text-white/90 font-medium"
          >
            Funcionalidades
          </button>
          <button
            onClick={() => { handleScroll("about-section"); setIsOpen(false); }}
            className="text-left py-2.5 border-b border-white/5 text-white/90 font-medium"
          >
            Sobre
          </button>

          {/* SEÇÃO DE CADASTRO EXPANDIDA NO MOBILE */}
          <div className="flex flex-col gap-1.5 pt-2">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold px-1">
              Criar nova conta
            </span>
            <Link
              to={FRONTEND_ROUTES.REGISTER.CLIENT}
              className="flex items-center gap-2 py-2 px-2 text-white/90 hover:bg-white/5 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 text-[#D8C4B6]" />
              Cadastro como Cliente
            </Link>
            <Link
              to={FRONTEND_ROUTES.REGISTER.DISPATCHER}
              className="flex items-center gap-2 py-2 px-2 text-white/90 hover:bg-white/5 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <Briefcase className="w-4 h-4 text-[#D8C4B6]" />
              Cadastro como Despachante
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
