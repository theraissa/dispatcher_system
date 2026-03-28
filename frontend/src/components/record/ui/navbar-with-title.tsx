import { cn } from "@/lib/utils";

interface NavbarProps {
  title: string;
  className?: string;
}

export default function Navbar({ title, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "w-full h-[70px] bg-[#21314D] text-white flex items-center px-6 shadow-md",
        className
      )}
    >
      {/* Container para o Logo, baseado na sua imagem anterior) */}
      <div className="flex-1 flex items-center">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
          <span className="font-bold text-xl">F</span>
        </div>
      </div>

      {/* Título Centralizado */}
      <nav className="flex-[2] flex justify-center items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>
      </nav>

      {/* Espaçador à direita para manter o título perfeitamente centralizado */}
      <div className="flex-1" />
    </header>
  );
}
