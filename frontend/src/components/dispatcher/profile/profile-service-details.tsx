import { useState } from "react";
import { ArrowLeft, Save, DollarSign, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileCard, ProfileContainer } from "./layout/profile-card";
import type { ServiceDetails } from "@/types/service.types";

/**
 * Props do componente ServiceDetails.
 */
type ServiceDetailsProps = {
  // Detalhes do serviço a ser configurado.
  serviceDetails: ServiceDetails;
  //Callback chamado ao clicar em "Voltar".
  onBack: () => void;
  //Callback responsável por salvar o valor do serviço.
  onSave: (serviceId: number, price: number) => Promise<void>;
};

/**
 * Componente responsável por configurar o valor de um serviço detalhado 
 * vinculado ao despachante.
 */
export default function ServiceDetails({
  serviceDetails, onBack, onSave,
}: ServiceDetailsProps) {

  // Inicializa com o valor atual do serviço (ou string vazia).
  const [price, setPrice] = useState(serviceDetails.price || "");

  const [loading, setLoading] = useState(false);

  /**
   * Manipula o salvamento do valor do serviço.
   *
   * Fluxo:
   * 1. Valida se existe valor
   * 2. Ativa estado de loading
   * 3. Chama callback onSave com ID e preço convertido
   * 4. Retorna para tela anterior após sucesso
   * 5. Desativa loading ao final (sucesso ou erro)
   */
  async function handleSave() {
    if (!price) return;

    try {
      setLoading(true);

      // Converte o valor de string para number antes de enviar
      await onSave(serviceDetails.service_id, Number(price));

      // Retorna para tela anterior após salvar com sucesso
      onBack();
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        {/* =========================
            CABEÇALHO DO COMPONENTE
           ========================= */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center gap-2 text-[#21314D] mb-2">
            <div className="p-2 bg-[#21314D]/5 rounded-lg">
              <DollarSign size={20} />
            </div>

            {/* Título principal da tela */}
            <h3 className="text-xl font-extrabold tracking-tight">
              Configurar Serviço
            </h3>
          </div>

          {/* Contexto do serviço sendo editado */}
          <p className="text-zinc-500 text-sm font-medium pl-1">
            Defina o valor para:{" "}
            <span className="text-[#1E1E1E] font-bold">
              {serviceDetails.name}
            </span>
          </p>
        </div>

        {/* =========================
            INPUT DE PREÇO
           ========================= */}
        <div className="py-6 space-y-4">
          <div className="flex flex-col gap-2">
            {/* Label descritiva do campo */}
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
              Valor do serviço (R$)
            </label>

            <div className="relative group">
              {/* Prefixo visual de moeda */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold group-focus-within:text-[#21314D]">
                R$
              </span>

              {/* Campo de input do valor */}
              <input
                type="number"
                placeholder="0,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={cn(
                  "w-full h-14 pl-12 pr-4 bg-zinc-50 border-2 border-transparent rounded-2xl",
                  "text-lg font-bold text-[#1E1E1E] outline-none transition-all",
                  "focus:bg-white focus:border-[#21314D] focus:ring-4 focus:ring-[#21314D]/5",
                  "placeholder:text-zinc-300"
                )}
              />
            </div>
          </div>
        </div>

        {/* =========================
            FOOTER (AÇÕES)
           ========================= */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100">

          {/* Ação de voltar sem salvar */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-zinc-500 font-bold text-sm hover:text-[#1E1E1E] transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>

          {/* Ação de salvar valor do serviço */}
          <button
            onClick={handleSave}
            disabled={loading || !price}
            className={cn(
              "flex items-center gap-2 px-8 py-3 bg-[#21314D] text-white rounded-xl font-bold text-sm shadow-sm",
              "hover:bg-[#1A263D] active:scale-95 transition-all disabled:opacity-50"
            )}
          >
            {/* Feedback visual de loading */}
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {/* Texto dinâmico baseado no estado */}
            {loading ? "Salvando..." : "Confirmar Valor"}
          </button>
        </div>
      </ProfileCard>
    </ProfileContainer>
  );
}
