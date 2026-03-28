import { cn } from "@/lib/utils";
import { Search, LayoutDashboard, MessageSquare, ShieldCheck } from "lucide-react";

export default function CarouselSection() {
  const cards = [
    {
      title: "1. Busca e Solicitação",
      icon: <Search className="w-6 h-6 text-[#21314D]" />,
      text: "Clientes pesquisam despachantes por nome ou município, acessam perfis e solicitam serviços com orientações claras sobre documentos.",
    },
    {
      title: "2. Gestão de Perfil",
      icon: <LayoutDashboard className="w-6 h-6 text-[#21314D]" />,
      text: "Despachantes controlam seus serviços: cadastram, editam atividades e acompanham chamados em tempo real com agenda organizada.",
    },
    {
      title: "3. Acompanhamento",
      icon: <MessageSquare className="w-6 h-6 text-[#21314D]" />,
      text: "Histórico e status atual de cada solicitação — de 'Pendente' a 'Completo' — garantindo transparência e comunicação eficiente.",
    },
    {
      title: "4. Segurança e Validação",
      icon: <ShieldCheck className="w-6 h-6 text-[#21314D]" />,
      text: "Validação de identidade, autenticação em dois fatores e verificação periódica do CRDD. Interações protegidas por criptografia.",
    },
  ];

  return (
    <section id="carousel-section" className="py-20 px-6 bg-[#F5EFE7]">
      <div className="max-w-7xl mx-auto">
        {/* Título da Seção (Opcional, mas ajuda no contexto) */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#1E1E1E] tracking-tight">Funcionalidades do Sistema</h2>
          <p className="text-zinc-600 mt-2">Tudo o que você precisa para gerenciar seus processos de trânsito.</p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={cn(
                "bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100",
                "transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default",
                "flex flex-col h-full"
              )}
            >
              <div className="mb-6 w-12 h-12 bg-[#21314D]/5 rounded-2xl flex items-center justify-center">
                {card.icon}
              </div>

              <h3 className="text-xl font-bold text-[#333] mb-4 leading-tight">
                {card.title}
              </h3>

              <p className="text-zinc-600 leading-relaxed text-sm">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
