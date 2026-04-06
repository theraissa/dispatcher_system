import { cn } from "@/lib/utils";

export default function AboutSection() {
  return (
    <section id="about-section" className="py-30 px-6 bg-[#D8C4B6] flex justify-center items-center">
      {/* Container Principal: Card Branco com Bordas Arredondadas */}
      <div className={cn(
        "max-w-4xl w-full bg-white p-10 md:p-16",
        "rounded-[40px] shadow-sm border-none",
        "flex flex-col items-center text-center space-y-8"
      )}>

        {/* Título: Reduzido de 50px para 36px (3xl) / 48px (5xl) */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E1E1E] tracking-tight">
          Sobre <span className="text-[#21314D]">Nós</span>
        </h2>

        {/* Bloco de Texto: Reduzido de 20px para 18px (lg) */}
        <div className="space-y-6 max-w-3xl">
          <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
            Somos uma plataforma web desenvolvida especialmente para modernizar e centralizar os serviços oferecidos por <strong>despachantes de trânsito</strong>. Nosso objetivo é conectar clientes a profissionais qualificados de forma prática, segura e eficiente.
          </p>

          <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
            Com uma interface intuitiva, permitimos que clientes encontrem despachantes em sua cidade e acompanhem o andamento de seus chamados em tempo real. Para os despachantes, oferecemos uma solução robusta para gerenciar perfis e serviços, otimizando sua rotina e ampliando sua visibilidade no mercado.
          </p>
        </div>

        {/* Detalhe de Rodapé da Seção (Opcional) */}
        <div className="pt-4 border-t border-zinc-100 w-full">
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
            Conectando Soluções e Pessoas
          </p>
        </div>
      </div>
    </section>
  );
}
