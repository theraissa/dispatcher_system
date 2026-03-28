import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const handleScroll = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

export default function NavbarHome() {
  // AJUSTE: BaseButton style compactado (texto menor, padding menor)
  const navItemStyles = cn(
    "text-white text-base font-medium px-4 py-1.5 rounded-lg transition-all",
    "hover:bg-white/10 cursor-pointer"
  );

  return (
    // AJUSTE: Altura de 70px para 60px. Padding vertical menor.
    <header className="w-full h-[60px] bg-[#21314D] text-white flex items-center justify-between px-6 shadow-md sticky top-0 z-50">

      {/* Lado Esquerdo: Logo Compacto */}
      <div className="flex items-center gap-2">
        {/* AJUSTE: Logo menor (w-7 h-7) e texto menor (text-lg) */}
        <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center font-extrabold text-lg text-white/90">
          D
        </div>
        <span className="font-semibold text-lg tracking-tight hidden md:block text-white/95">
          Dispatcher
        </span>
      </div>

      {/* Lado Direito: Links e Botões de Ação */}
      <nav className="flex items-center gap-2">
        <ul className="flex items-center gap-1 mr-3">
          <li>
            <button
              onClick={() => handleScroll("carousel-section")}
              className={navItemStyles}
            >
              Funcionalidades
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll("about-section")}
              className={navItemStyles}
            >
              Sobre
            </button>
          </li>
        </ul>

        {/* AJUSTE: Separador mais discreto */}
        <div className="flex items-center gap-2.5 border-l border-white/15 pl-5">
          {/* AJUSTE: Botões de Link compactos (texto menor, padding menor) */}
          <Link
            to="/login"
            className={cn(
              "px-5 py-1.5 bg-white text-[#21314D] font-semibold text-sm rounded-lg",
              "transition-all hover:bg-[#F3EDE2] hover:scale-[1.03] active:scale-95 shadow-sm"
            )}
          >
            Login
          </Link>

          <Link
            to="/register/client"
            className={cn(
              "px-5 py-1.5 bg-[#3E5879] text-white font-semibold text-sm rounded-lg",
              "transition-all hover:bg-white hover:text-[#21314D] border border-transparent hover:border-zinc-200",
              "active:scale-95 shadow-sm"
            )}
          >
            Cadastrar
          </Link>
        </div>
      </nav>
    </header>
  );
}
