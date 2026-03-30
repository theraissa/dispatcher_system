import { User, MapPin } from "lucide-react";

export default function CardDispatcher({ dispatchers, loading }) {

  if (loading) {
    return (
      <p className="col-span-full text-center text-zinc-400">
        Carregando despachantes...
      </p>
    );
  }

  if (!dispatchers || dispatchers.length === 0) {
    return (
      <p className="col-span-full text-center text-zinc-400">
        Nenhum despachante encontrado.
      </p>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl mx-auto px-6 pb-20">
      {dispatchers.map((dispatcher) => (
        <div
          key={dispatcher.dispatcher.id}
          className="group bg-white p-4 rounded-[32px] shadow-sm border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          {/* Foto */}
          <div className="relative w-full aspect-square bg-zinc-100 rounded-[24px] overflow-hidden mb-4">
            <div className="w-full h-full flex items-center justify-center text-zinc-300">
              <User size={48} strokeWidth={1.5} />
            </div>
          </div>

          {/* Info */}
          <div className="px-2 space-y-1">
            <h4 className="font-extrabold text-[#1E1E1E] text-lg tracking-tight group-hover:text-[#21314D] transition-colors">
              {dispatcher.user.name}
            </h4>

            <div className="flex items-center gap-1.5 text-zinc-500">
              <MapPin size={14} />
              <span className="text-xs font-medium">
                {dispatcher.office.city}, {dispatcher.office.state}
              </span>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Ver Perfil
              </span>

              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[#21314D] group-hover:text-white transition-all">
                →
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
