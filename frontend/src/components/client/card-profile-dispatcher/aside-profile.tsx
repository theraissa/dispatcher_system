import { User, MapPin, Phone, ShieldCheck, Mail } from "lucide-react";



export function AsideProfileDispatcher({ dispatcher }) {
    return (
        <aside>
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100 sticky top-24">
                <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="w-full h-full bg-zinc-50 rounded-[24px] flex items-center justify-center text-zinc-300 border border-zinc-100 overflow-hidden">
                        <User size={48} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[#21314D] p-1.5 rounded-lg shadow-md border-2 border-white">
                        <ShieldCheck size={16} className="text-white" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold tracking-tight">{dispatcher.name}</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mt-1">Profissional Credenciado</p>
                </div>

                <div className="space-y-1">
                    {[
                        { icon: <MapPin size={16} />, label: "Localização", value: `${dispatcher.city}, ${dispatcher.state}` },
                        { icon: <Phone size={16} />, label: "Contato", value: dispatcher.contact },
                        { icon: <Mail size={16} />, label: "E-mail", value: dispatcher.email }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                            <div className="text-[#21314D] mt-0.5 opacity-70">{item.icon}</div>
                            <div>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{item.label}</p>
                                <p className="text-sm font-medium text-zinc-700">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
