import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-logout"; // Importe seu hook aqui

type NavLink = {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

type NavbarPageProps = {
  title: string;
  shortTitle?: string;
  links: NavLink[];
}

export default function NavbarPage({ title, shortTitle = "P", links }: NavbarPageProps) {
  const location = useLocation();
  const { logout } = useLogout();

  const buttonStyles = (isActive: boolean) => cn(
    "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200",
    isActive
      ? "bg-white text-[#21314D] shadow-sm scale-105"
      : "text-white/80 hover:bg-white/10 hover:text-white"
  );

  return (
    <header className="w-full h-[60px] bg-[#21314D] text-white flex items-center justify-between px-6 shadow-md sticky top-0 z-50">

      {/* LADO ESQUERDO: DINÂMICO */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center font-extrabold text-xs">
          {shortTitle}
        </div>
        <span className="text-sm font-bold tracking-tight hidden sm:block italic opacity-90">
          {title}
        </span>
      </div>

      {/* LADO DIREITO: MAPEAR LINKS */}
      <nav className="flex items-center gap-1 md:gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={buttonStyles(isActive)}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          );
        })}

        {/* BOTÃO DE LOGOUT - AGORA AUTOSSUFICIENTE */}
        <button
          onClick={logout}
          className={cn(
            buttonStyles(false),
            "hover:bg-red-500/20 hover:text-red-400 ml-2"
          )}
        >
          <LogOut size={16} strokeWidth={2} />
          <span className="hidden md:inline">Sair</span>
        </button>
      </nav>
    </header>
  );
}
