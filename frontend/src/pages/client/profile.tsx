import { Save } from "lucide-react";

import NavbarPage from "../../components/record/ui/navbar-page";
import FormProfileClient from "@/components/client/profile/profile-client-form";
import ProfileClientAvatar from "@/components/client/profile/profile-client-avatar";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { useClientProfile } from "@/hooks/use-client-profile";
import { useState } from "react";


export default function ProfileClient() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const [isEditing, setIsEditing] = useState(false);
    const { data, loading, handleChange, handleSubmit } = useClientProfile(storedUser?.id);

    if (loading || !data) return <p className="text-center p-10">Carregando...</p>;

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        await handleSubmit();
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            <NavbarPage title="Central do Cliente" shortTitle="C" links={clientLinksNavbar} />

            <main className="max-w-5xl mx-auto py-10 px-6">
                <form onSubmit={handleSave}>
                    <div className="flex flex-col gap-8">
                        {/* Avatar/Header agora recebe o controle de edição */}
                        <ProfileClientAvatar
                            user={data.user}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                        />

                        <FormProfileClient
                            data={data}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />
                    </div>

                    {/* Botão Flutuante de Salvar (Aparece apenas quando editando) */}
                    {isEditing && (
                        <div className="fixed bottom-8 right-8 z-50">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Save size={20} />
                                Salvar Alterações
                            </button>
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}
