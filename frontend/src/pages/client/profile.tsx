import ProfileClientAvatar from "@/components/client/profile/profile-client-avatar";
import FormProfileClient from "@/components/client/profile/profile-client-form";
import { useClientProfile } from "@/hooks/use-client-profile";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { useState } from "react";
import NavbarPage from "../../components/record/ui/navbar-page";


/**
 * Componente responsável por gerenciar o perfil do cliente.
 */
export default function ProfileClient() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const [isEditing, setIsEditing] = useState(false);
    const { data, loading, handleChange, handleSubmit } = useClientProfile(storedUser?.id);

    const handleSave = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        await handleSubmit();
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            <NavbarPage title="Central do Cliente" shortTitle="C" links={clientLinksNavbar} />

            <main className="max-w-5xl mx-auto py-10 px-6">
                {/* A estrutura principal (Navbar e Main) sempre renderiza.
                   O conteúdo interno é que alterna entre Skeleton e Formulário.
                */}
                <div className={`transition-opacity duration-500 ${loading ? 'opacity-70' : 'opacity-100'}`}>
                    {loading || !data ? (
                        <ProfileSkeleton />
                    ) : (
                        <form onSubmit={handleSave}>
                            <div className="flex flex-col gap-8">
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
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="flex flex-col gap-8 animate-pulse">
            {/* Skeleton do Avatar/Header */}
            <div className="bg-white p-8 rounded-[32px] border border-zinc-100 flex flex-col items-center sm:flex-row sm:justify-start gap-6">
                <div className="w-32 h-32 bg-zinc-200 rounded-full" />
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-zinc-200 rounded-lg w-48" />
                    <div className="h-4 bg-zinc-200 rounded-lg w-32" />
                </div>
            </div>

            {/* Skeleton do Formulário */}
            <div className="bg-white p-8 rounded-[32px] border border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="space-y-2">
                        <div className="h-3 bg-zinc-100 rounded w-20" />
                        <div className="h-12 bg-zinc-50 rounded-xl border border-zinc-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}
