import { Search, Calendar, Hash, MapPin } from "lucide-react";


export default function CalledClientFilter() {
    const inputStyles = "w-full h-10 pl-10 pr-4 bg-white border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-[#21314D]/10 outline-none transition-all";
    const iconStyles = "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="relative group">
                <Search className={iconStyles} size={16} />
                <input type="text" placeholder="Serviço..." className={inputStyles} />
            </div>
            <div className="relative group">
                <Hash className={iconStyles} size={16} />
                <input type="text" placeholder="Número..." className={inputStyles} />
            </div>
            <div className="relative group">
                <Calendar className={iconStyles} size={16} />
                <input type="text" placeholder="Data Abertura..." className={inputStyles} />
            </div>
            <div className="relative group">
                <MapPin className={iconStyles} size={16} />
                <input type="text" placeholder="Estado..." className={inputStyles} />
            </div>
        </div>
    );
}
