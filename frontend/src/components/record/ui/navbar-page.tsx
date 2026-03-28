import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ClipboardList, User } from "lucide-react";

export default function NavbarPage() {
  const location = useLocation();

  // Estilo base para os botões da Navbar
  const buttonStyles = (isActive: boolean) => cn(
    "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200",
    isActive
      ? "bg-white text-[#21314D] shadow-sm"
      : "text-white/80 hover:bg-white/10 hover:text-white"
  );

  return (
    <header className="w-full h-[60px] bg-[#21314D] text-white flex items-center justify-between px-6 shadow-md sticky top-0 z-50">

      {/* Lado Esquerdo: Identificação rápida da área logada */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center font-bold text-sm">
          P
        </div>
        <span className="text-sm font-semibold tracking-wide hidden sm:block">
          Painel do Despachante
        </span>
      </div>

      {/* Lado Direito: Navegação Principal */}
      <nav className="flex items-center gap-2">
        <Link
          to="/dashboard"
          className={buttonStyles(location.pathname === "/dashboard")}
        >
          <ClipboardList size={16} />
          Chamados
        </Link>

        <Link
          to="/profile"
          className={buttonStyles(location.pathname === "/profile")}
        >
          <User size={16} />
          Seu Perfil
        </Link>
      </nav>
    </header>
  );
}
