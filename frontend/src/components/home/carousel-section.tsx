import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Search, ShieldCheck } from "lucide-react";

/**
 * Componente de Funcionalidades (Carousel/Grid).
 */
export default function CarouselSection() {

  const cards = [
    {
      title: "1. Busca, Comparação e Solicitação",
      icon: <Search className="w-6 h-6 text-[#21314D]" />,
      text: "Clientes pesquisam despachantes por nome ou município, comparam valores e avaliações, acessam perfis completos e solicitam serviços com orientações claras sobre documentos.",
    },
    {
      title: "2. Gestão de Perfil e Serviços",
      icon: <LayoutDashboard className="w-6 h-6 text-[#21314D]" />,
      text: "Despachantes controlam seus serviços: cadastram, editam atividades, definem preços e acompanham chamados em tempo real com agenda organizada.",
    },
    {
      title: "3. Acompanhamento e Transparência",
      icon: <MessageSquare className="w-6 h-6 text-[#21314D]" />,
      text: "Histórico e status atual de cada solicitação — de 'Pendente' a 'Em Andamento' ou 'Finalizada' — garantindo transparência e comunicação eficiente entre cliente e despachante de trânsito.",
    },
    {
      title: "4. Segurança e Credibilidade",
      icon: <ShieldCheck className="w-6 h-6 text-[#21314D]" />,
      text: "Apenas despachantes habilitados atuam na plataforma, com interações protegidas por criptografia.",
    },
  ];

  return (

    <section id="carousel-section" className="py-16 md:py-24 px-6 bg-[#F5EFE7]">
      <div className="max-w-7xl mx-auto">

        {/* Cabeçalho da Seção: Alinhamento centralizado no mobile para melhor leitura */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] tracking-tight">
            Funcionalidades do Sistema
          </h2>
          <p className="text-zinc-600 mt-3 text-base md:text-lg max-w-3xl">
            Tudo o que você precisa para gerenciar seus processos de trânsito em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={cn(
                /* Bordas arredondadas levemente menores no mobile (rounded-2xl) para ganhar espaço */
                "bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-zinc-100",
                "transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default",
                "flex flex-col h-full"
              )}
            >
              {/* Container do Ícone */}
              <div className="mb-6 w-12 h-12 bg-[#21314D]/5 rounded-2xl flex items-center justify-center">
                {card.icon}
              </div>

              {/* Título do Card: text-lg no mobile para não quebrar muitas linhas */}
              <h3 className="text-lg md:text-xl font-bold text-[#333] mb-4 leading-tight">
                {card.title}
              </h3>

              {/* Descrição: h-full no container pai garante que todos os cards tenham a mesma altura */}
              <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
