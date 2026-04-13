import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import type { ProfileDispatcher } from "@/types/dispatcher.types";
import { User, MapPin } from "lucide-react";
import { Link } from "react-router-dom";


/**
 * Props do componente de listagem de despachantes.
 *
 * - dispatchers: lista de despachantes retornada da busca
 * - loading: indica se a busca ainda está em andamento
 * - hasSearched: controla se o usuário já realizou alguma busca
 */
type CardDispatcherProps = {
  dispatchers: ProfileDispatcher[];
  loading: boolean;
  hasSearched: boolean;
};


/**
 * Componente responsável por renderizar os cards de despachantes.
 *
 * Responsabilidades:
 * - Controlar estados visuais (loading, vazio, sem busca)
 * - Renderizar lista de despachantes em formato de grid
 * - Permitir navegação para o perfil do despachante
 */
export default function CardDispatcher({ dispatchers, loading, hasSearched }: CardDispatcherProps) {

  /**
   * Estado de carregamento:
   * exibido enquanto os dados ainda estão sendo buscados no backend
   */
  if (loading) {
    return (
      <p className="col-span-full text-center text-zinc-400">
        Carregando despachantes...
      </p>
    );
  }

  /**
   * Estado inicial:
   * exibido antes do usuário realizar uma busca
   */
  if (!hasSearched) {
    return (
      <p className="col-span-full text-center text-zinc-400">
        Busque por um despachante para começar.
      </p>
    );
  }

  /**
   * Estado vazio:
   * exibido quando a busca não retorna resultados
   */
  if (dispatchers.length === 0) {
    return (
      <p className="col-span-full text-center text-zinc-400">
        Nenhum despachante encontrado.
      </p>
    );
  }
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl mx-auto px-6 pb-20">
      {dispatchers.map((dispatcher) => (

        /**
         * Cada card é um Link para o perfil do despachante.
         * O ID é injetado na rota dinâmica (:userId).
         */
        <Link
          key={dispatcher.user.id}
          to={FRONTEND_ROUTES.CLIENT.CARD_PROFILE_DISPATCHER.replace(":userId", dispatcher.user.id.toString())}
          className="group bg-white p-4 rounded-[32px] shadow-sm border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >

          {/* Foto */}
          <div className="relative w-full aspect-square bg-zinc-100 rounded-[24px] overflow-hidden mb-4">
            <div className="w-full h-full flex items-center justify-center text-zinc-300">
              <User size={48} strokeWidth={1.5} />
            </div>
          </div>

          {/* Informações principais do despachante */}

          <div className="px-2 space-y-1">
            {/* Nome do despachante */}
            <h4 className="font-extrabold text-[#1E1E1E] text-lg tracking-tight group-hover:text-[#21314D] transition-colors">
              {dispatcher.user.name}
            </h4>

            {/* Localização (cidade + estado) */}
            <div className="flex items-center gap-1.5 text-zinc-500">
              <MapPin size={14} />
              <span className="text-xs font-medium">
                {dispatcher.office.city}, {dispatcher.office.state}
              </span>
            </div>

            {/* Call-to-action para visualizar perfil */}
            <div className="pt-3 flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Ver Perfil
              </span>

              {/* Ícone com efeito de hover */}
              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#21314D] group-hover:text-white transition-all">
                →
              </div>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
