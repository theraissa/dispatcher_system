import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function LoginSection() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    navigate("/login", { state: { email } });
  }

  return (
    <section className="relative flex flex-col items-center justify-center py-20 md:py-50 px-6 bg-[#D8C4B6]">
      {/* Sutil detalhe de fundo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#21314D_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-4">
        {/* Título: Reduzido de 75px para 48px/60px (4xl/6xl) */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#1E1E1E] tracking-tight leading-tight">
          Despachante de <span className="text-[#21314D]">Trânsito</span>
        </h1>

        {/* Texto: Reduzido de 25px para 18px (lg) */}
        <p className="text-base md:text-lg text-zinc-700 max-w-xl mx-auto">
          Sistema Web para centralizar serviços e comunicação, <br className="hidden md:block" />
          otimizando a gestão do seu escritório.
        </p>

        {/* Formulário: Altura reduzida de 14 para 12 (h-12) */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-2 pt-6"
        >
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
              "w-full md:w-[400px] h-12 px-5 bg-white border border-zinc-200",
              "rounded-xl text-base shadow-sm outline-none transition-all",
              "focus:border-[#21314D] focus:ring-2 focus:ring-[#21314D]/10",
              "placeholder:text-zinc-400"
            )}
          />

          <button
            type="submit"
            className={cn(
              "h-12 px-8 bg-[#21314D] text-white font-bold text-base rounded-xl shadow-sm",
              "flex items-center gap-2 transition-all hover:bg-[#1A263D] active:scale-95 group"
            )}
          >
            Entrar
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </section>
  );
}
