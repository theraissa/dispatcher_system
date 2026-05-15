import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Componente de banner da página inicial do despachante.
 *
 * Responsabilidades:
 * - Exibir uma mensagem dinâmica de boas-vindas (motivacional/contextual)
 * - Apresentar atalhos visuais para links externos importantes (CRDD-RS e DETRAN-RS)
 * - Melhorar a experiência inicial do usuário com conteúdo leve e informativo
 * 
 * @returns Seção visual com mensagem dinâmica e atalhos institucionais
 */
export function HomeBannerDispatcher() {

    const messages = [
        "Pronto para gerenciar seus atendimentos?",
        "Tudo sob controle por aqui.",
        "Seu dia começa aqui.",
        "Organize, acompanhe e avance.",
        "Seu fluxo de trabalho, simplificado.",
        "Que bom te ver por aqui!",
        "Vamos dar andamento nos atendimentos?",
        "Mais um dia para ajudar seus clientes.",
        "Hora de colocar tudo em dia.",
        "Agilidade e confiança no seu dia a dia.",
        "Seu trabalho, mais eficiente.",
        "Profissionalismo que gera resultados."
    ];

    const [greeting] = useState(() => {
        return messages[Math.floor(Math.random() * messages.length)];
    });

    return (
        <section className="text-center space-y-6 md:space-y-10">
            {/* TÍTULO MOTIVACIONAL REESTILIZADO */}
            <div className="flex flex-col items-center justify-center space-y-3 py-4 md:py-6">
                <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#21314D]/5 text-[#21314D] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                    <Sparkles size={12} />
                    Status do Dia
                </div>

                {/* Ajuste: text-3xl no mobile para não quebrar frases */}
                <h1 className="text-3xl md:text-5xl font-black text-[#1E1E1E] tracking-tighter leading-tight px-2">
                    {greeting}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Banner 1: CRDD-RS (AZUL) */}
                <Link
                    to="https://www.crddrs.org/"
                    target="_blank"
                    className="group relative h-56 md:h-64 bg-[#21314D] rounded-[32px] md:rounded-[40px] shadow-xl p-8 md:p-10 text-white flex flex-col justify-center text-left overflow-hidden transition-all hover:scale-[1.01]"
                >
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/20">
                            <ArrowRight className="group-hover:rotate-[-45deg] transition-transform" size={20} />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tighter uppercase">CRDD-RS</h3>
                        <p className="text-sm md:font-medium opacity-70 mt-2 max-w-[280px]">Conselho Regional dos Despachantes Documentalistas do RS</p>
                    </div>
                </Link>

                {/* Banner 2: DETRAN RS (LARANJA) */}
                <Link
                    to="https://www.detran.rs.gov.br/inicial"
                    target="_blank"
                    className="group relative h-56 md:h-64 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[32px] md:rounded-[40px] shadow-xl p-8 md:p-10 text-white flex flex-col justify-center text-left overflow-hidden transition-all hover:scale-[1.01]"
                >
                    <div className="relative z-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 border border-white/30 text-white">
                            <ArrowRight className="group-hover:rotate-[-45deg] transition-transform" size={20} />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tighter uppercase">Detran RS</h3>
                        <p className="text-sm md:font-medium opacity-90 mt-2 max-w-[280px]">Confira as mudanças e pesquise por novos serviços.</p>
                    </div>
                </Link>
            </div>
        </section>
    );
}
