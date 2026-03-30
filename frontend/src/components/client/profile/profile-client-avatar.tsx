import { User, Camera } from "lucide-react";

export default function ProfileClientAvatar() {
    return (
        <aside className="w-full lg:w-1/3 sticky top-24">
            <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm flex flex-col items-center text-center">
                <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 bg-zinc-100 rounded-[40px] flex items-center justify-center text-zinc-300 overflow-hidden border-4 border-white shadow-md">
                        <User size={64} strokeWidth={1.5} />
                        {/* Overlay de Upload */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                <h2 className="mt-4 text-xl font-extrabold text-[#1E1E1E]">Seu Perfil</h2>
                <p className="text-sm text-zinc-500 font-medium">Mantenha seus dados atualizados para facilitar o contato.</p>
            </div>
        </aside>
    );
}   
