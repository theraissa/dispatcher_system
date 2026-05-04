import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Componente de Hero/Login da Home.
 * Apresenta a proposta de valor e um campo de captura de e-mail que 
 * redireciona o usuário para a tela de login real.
 */
export default function LoginSection() {
  // Estado para capturar o e-mail antes de redirecionar o usuário
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  /**
   * Manipula o envio do formulário.
   * Envia o e-mail digitado via estado do roteador para preencher automaticamente o campo na tela de login.
   */
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    navigate("/login", { state: { email } });
  }

  return (
    <section className="relative flex flex-col items-center justify-center py-16 md:py-32 px-6 bg-[#D8C4B6] overflow-hidden">

      {/* Detalhe visual de fundo: Grid de pontos sutil */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#21314D_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-6">

        {/* Título Responsivo: */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#1E1E1E] tracking-tight leading-[1.1]">
          Despachante de <span className="text-[#21314D]">Trânsito</span>
        </h1>

        {/* Texto de apoio: text-base (mobile) -> text-lg (desktop) */}
        <p className="text-base md:text-lg text-zinc-700 max-w-xl mx-auto leading-relaxed">
          Sistema Web para centralizar serviços e comunicação,
          <br className="hidden md:block" /> {/* Quebra de linha apenas no desktop */}
          otimizando a gestão do seu escritório.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-3 pt-6 w-full max-w-lg mx-auto"
        >
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
              "w-full md:w-[350px] h-12 px-5 bg-white border border-zinc-200",
              "rounded-xl text-base shadow-sm outline-none transition-all",
              "focus:border-[#21314D] focus:ring-2 focus:ring-[#21314D]/10",
              "placeholder:text-zinc-400"
            )}
          />

          <button
            type="submit"
            className={cn(
              "w-full md:w-auto h-12 px-8 bg-[#21314D] text-white font-bold text-base rounded-xl shadow-md",
              "flex items-center justify-center gap-2 transition-all",
              "hover:bg-[#1A263D] active:scale-95 group"
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
