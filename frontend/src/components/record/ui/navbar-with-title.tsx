import { cn } from "@/lib/utils";

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
      <div className="flex-1 flex items-center">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/5">
          <span className="font-bold text-xl">D</span> {/* Alterado para D de Dispatcher conforme as anteriores */}
        </div>
      </div>

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
