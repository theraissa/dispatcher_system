import { cn } from "@/lib/utils";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { Workflow } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Propriedades da Navbar.
 * @param {string} title - O título centralizado que muda conforme a página.
 * @param {string} [className] - Classes extras para customização pontual.
 */
interface NavbarProps {
  title: string;
  className?: string;
}

/**
 * Navbar simplificada para telas de registro e login.
 * Focada em manter o título centralizado e legível em qualquer dispositivo.
 */
export default function Navbar({ title, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "w-full h-[60px] md:h-[70px] bg-[#21314D] text-white flex items-center px-4 md:px-6 shadow-md sticky top-0 z-50",
        className
      )}
    >
      {/* 
          Lado Esquerdo: Logo. 
      */}
      <Link
        to={FRONTEND_ROUTES.HOME || "/"}
        className="flex-1 flex items-center gap-2.5 group cursor-pointer select-none"
      >
        {/* Box do Ícone */}
        <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/5 shadow-inner transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105 shrink-0">
          <Workflow className="w-4 h-4 text-white transition-transform duration-500 group-hover:rotate-12" />
        </div>

        {/* Nome da Aplicação*/}
        <span className="font-bold text-sm md:text-lg tracking-tight transition-colors group-hover:text-zinc-200 hidden sm:block">
          Conecta Despachante
        </span>
      </Link>

      {/* 
          Título Centralizado: 
      */}
      <nav className="flex-[4] md:flex-[2] flex justify-center items-center">
        <h1 className="text-lg md:text-2xl font-semibold tracking-tight text-center truncate px-2">
          {title}
        </h1>
      </nav>

      {/* 
          Espaçador à direita: 
          Fundamental para manter o título perfeitamente no centro (técnica do flexbox).
      */}
      <div className="flex-1" />
    </header>
  );
}
