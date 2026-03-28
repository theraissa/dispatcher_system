import { useState } from "react";
import { ArrowLeft, Save, DollarSign, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileCard, ProfileContainer } from "./layout/profile-card";

type Service = {
  id: number;
  name: string;
  price?: number;
};

type Props = {
  service: Service;
  onBack: () => void;
  onSave: (serviceId: number, price: number) => Promise<void>;
};

export default function ServiceDetails({ service, onBack, onSave }: Props) {
  const [price, setPrice] = useState(service.price || "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!price) return;
    try {
      setLoading(true);
      await onSave(service.id, Number(price));
      onBack();
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        {/* Cabeçalho do Card de Edição */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center gap-2 text-[#21314D] mb-2">
            <div className="p-2 bg-[#21314D]/5 rounded-lg">
              <DollarSign size={20} />
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">Configurar Serviço</h3>
          </div>
          <p className="text-zinc-500 text-sm font-medium pl-1">
            Defina o valor para: <span className="text-[#1E1E1E] font-bold">{service.name}</span>
          </p>
        </div>

        {/* Área de Input Centralizada e Enxuta */}
        <div className="py-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
              Valor do serviço (R$)
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold group-focus-within:text-[#21314D]">
                R$
              </span>
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

        {/* Footer com botões menores e elegantes */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-zinc-500 font-bold text-sm hover:text-[#1E1E1E] transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>

          <button
            onClick={handleSave}
            disabled={loading || !price}
            className={cn(
              "flex items-center gap-2 px-8 py-3 bg-[#21314D] text-white rounded-xl font-bold text-sm shadow-sm",
              "hover:bg-[#1A263D] active:scale-95 transition-all disabled:opacity-50"
            )}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? "Salvando..." : "Confirmar Valor"}
          </button>
        </div>
      </ProfileCard>
    </ProfileContainer>
  );
}
