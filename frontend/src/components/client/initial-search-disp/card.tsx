import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import type { ProfileDispatcher } from "@/types/dispatcher.types";
import { FileText, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Props do componente de listagem de despachantes.
 *
 * @property {ProfileDispatcher[]} dispatchers - Lista de despachantes retornada após a busca.
 * @property {boolean} loading - Indica se a requisição ao backend está em andamento.
 * @property {boolean} hasSearched - Controla se o usuário já submeteu alguma busca na sessão atual.
 * @property {string} searchTerm - O termo textual digitado pelo usuário (usado para destacar o serviço correspondente).
 */
type CardDispatcherProps = {
  dispatchers: ProfileDispatcher[];
  loading: boolean;
  hasSearched: boolean;
  searchTerm: string;
};

/**
 * Componente responsável por renderizar os cards de despachantes em formato de grid.
 *
 * Responsabilidades:
 * - Gerenciar estados visuais assíncronos (carregamento com Skeletons, estado inicial e busca sem resultados).
 * - Identificar e destacar dinamicamente o serviço que corresponde ao termo pesquisado.
 * - Garantir a navegação segura para o perfil detalhado utilizando o ID da entidade do despachante.
 */
export default function CardDispatcher({ dispatchers, loading, hasSearched, searchTerm }: CardDispatcherProps) {

  /**
   * Estado de carregamento:
   * Exibe skeletons pulsantes simples mantendo a estrutura visual estável
   */
  if (loading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl mx-auto px-4 md:px-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white p-4 rounded-[32px] border border-zinc-100 space-y-4 animate-pulse">
            <div className="w-full aspect-square bg-zinc-100 rounded-[24px]" />
            <div className="h-5 bg-zinc-200 rounded w-2/3" />
            <div className="h-4 bg-zinc-100 rounded w-1/2" />
          </div>
        ))}
      </section>
    );
  }

  /**
   * Estado inicial:
   * Exibido antes de o usuário realizar qualquer ação de busca no sistema.
   */
  if (!hasSearched) {
    return (
      <p className="col-span-full text-center text-zinc-400 font-medium py-12">
        Busque por um despachante, serviço ou cidade para começar.
      </p>
    );
  }

  /**
   * Estado vazio:
   * Exibido quando a consulta retorna uma lista sem registros correspondentes.
   */
  if (dispatchers.length === 0) {
    return (
      <p className="col-span-full text-center text-zinc-400 font-medium py-12">
        Nenhum despachante encontrado.
      </p>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl mx-auto px-4 md:px-6 pb-20">
      {dispatchers.map((dispatcher) => {
        const servicesList = dispatcher.service_details || [];

        // 1. Procura na lista se algum serviço bate textualmente com o termo que o usuário digitou
        let matchedService = servicesList.find((service) =>
          service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // 2. Se o usuário buscou por nome ou cidade (e não por serviço), o 'matchedService' será undefined.
        // Nesse caso, escolhemos o primeiro serviço cadastrado dele para exibir como destaque genérico.
        if (!matchedService && servicesList.length > 0) {
          matchedService = servicesList[0];
        }

        return (
          /**
           * Cada card atua como um Link direcionando para o perfil específico do profissional.
           * CORREÇÃO: Redirecionamento configurado explicitamente com o ID do Despachante (dispatcher.dispatcher.id)
           * para evitar colisões com o ID sequencial de Usuários gerais.
           */
          <Link
            key={dispatcher.user.id}
            to={FRONTEND_ROUTES.CLIENT.CARD_PROFILE_DISPATCHER.replace(":userId", dispatcher.dispatcher.id.toString())}
            className="group bg-white p-4 rounded-[28px] md:rounded-[32px] shadow-sm border border-zinc-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Container da Imagem de Perfil (Placeholder com Ícone) */}
              <div className="relative w-full aspect-square bg-zinc-50 border border-zinc-100 rounded-[20px] md:rounded-[24px] overflow-hidden mb-4 flex items-center justify-center text-zinc-300 group-hover:scale-[1.01] transition-transform duration-300">
                <User size={52} strokeWidth={1.2} />
              </div>

              {/* Informações textuais básicas */}
              <div className="px-1 space-y-1">
                {/* Nome do profissional cadastrado */}
                <h4 className="font-extrabold text-[#1E1E1E] text-base md:text-lg truncate group-hover:text-[#21314D] transition-colors">
                  {dispatcher.user.name}
                </h4>

                {/* Localização geográfica vinculada ao endereço */}
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <MapPin size={14} />
                  <span className="text-xs font-semibold tracking-tight">
                    {dispatcher.address.city}, {dispatcher.address.state}
                  </span>
                </div>

                {/* Bloco Dinâmico do Serviço Encontrado ou Principal */}
                {matchedService && (
                  <div className="mt-4 p-3 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <FileText size={13} className="text-[#21314D]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 truncate">
                        {matchedService.service_name}
                      </span>
                    </div>
                    {/* Exibição do valor formatado em formato monetário nacional */}
                    <div className="text-sm font-black text-[#21314D]">
                      {matchedService.price
                        ? `R$ ${matchedService.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                        : "Sob consulta"
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé do Card com Call-to-action */}
            <div className="px-1 pt-4 flex justify-between items-center border-t border-zinc-50 mt-5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-[#21314D] transition-colors">
                Ver Perfil
              </span>
              {/* Indicador visual de ação interativa (efeito de translação no hover) */}
              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#21314D] group-hover:text-white transition-all group-hover:translate-x-0.5">
                →
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
