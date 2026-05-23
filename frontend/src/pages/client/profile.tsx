import FormProfileClient from "@/components/client/profile/profile-client-form";
import ProfileHeader from "@/components/layout/profile-header";
import { useAuthRequired } from "@/hooks/auth/auth-requirered";
import { useClientProfile } from "@/hooks/client/use-client-profile";
import { useUpdateClientProfilePublic } from "@/hooks/client/use-user-profile-public";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { useState } from "react";
import NavbarPage from "../../components/record/ui/navbar-page";


/**
 * Página responsável por exibir o perfil do usuário cliente.
 */
export default function ProfileClient() {

    const { user } = useAuthRequired()

    // Controla modo de edição da tela
    const [isEditing, setIsEditing] = useState(false);

    // Hook responsável pelos dados internos do cliente
    const { data, loading, handleChange, handleSubmit } = useClientProfile(user.id);

    // Hook responsável pela atualização do perfil público
    const { updateProfile, isLoading: isUpdatingPublic } = useUpdateClientProfilePublic();

    // Armazena alterações temporárias feitas no header durante edição
    const [pendingPublicData, setPendingPublicData] = useState<{
        instagram?: string;
        website?: string;
        photoFile?: File;
    } | null>(null);

    // Armazena dados públicos atualizados após salvar no backend
    const [publicDataOverride, setPublicDataOverride] = useState<{
        instagram?: string;
        website?: string;
        photo?: string;
    } | null>(null);

    /**
     * Recebe alterações feitas no componente ProfileHeader.
     */
    const handleHeaderChange = (
        newPublicData: {
            instagram?: string;
            website?: string;
            photoFile?: File
        }
    ) => {
        setPendingPublicData(newPublicData);
    };

    /**
     * Salva todos os dados da tela.
     */
    const handleSaveAllData = async (e: React.FormEvent) => {
        // Evita recarregamento padrão do form
        if (e) e.preventDefault();

        try {
            // Lista de requisições executadas em paralelo
            const promises: Promise<any>[] = [
                // Atualiza dados internos do perfil
                handleSubmit()
            ];

            // Adiciona atualização pública caso exista alteração
            if (pendingPublicData) {
                promises.push(
                    updateProfile(user.id, {
                        instagram: pendingPublicData.instagram || "",
                        website: pendingPublicData.website || "",
                        photo: pendingPublicData.photoFile ?? ""
                    })
                );
            }
            // Executa todas requisições simultaneamente
            const results = await Promise.all(promises);

            // Resultado da atualização pública
            const updatedPublicData = results[1];

            if (updatedPublicData) {
                // Atualiza estado visual da tela
                setPublicDataOverride({
                    instagram: updatedPublicData.instagram,
                    website: updatedPublicData.website,
                    photo: updatedPublicData.photo,
                });

                // Atualiza foto do usuário no localStorage
                const newUserLocalStorage = {
                    ...user,
                    photo: updatedPublicData.photo
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(newUserLocalStorage)
                );
            }
            // Limpa alterações temporárias
            setPendingPublicData(null);
            // Finaliza modo edição
            setIsEditing(false);
        } catch (error) {
            console.error(
                "Erro ao salvar informações do perfil:",
                error
            );
        }
    };

    // Combina dados originais com overrides atualizados
    const displayUser = data?.user ? {
        ...data.user,
        instagram: publicDataOverride?.instagram ?? data.user.instagram,
        website: publicDataOverride?.website ?? data.user.website,
        photo: publicDataOverride?.photo ?? data.user.photo,
    } : null;

    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            <NavbarPage title="Central do Cliente" shortTitle="C" links={clientLinksNavbar} />

            <main className="max-w-4xl mx-auto py-6 md:py-10 px-4 md:px-6">
                <div className={`transition-opacity duration-500 ${(loading || isUpdatingPublic) ? 'opacity-70' : 'opacity-100'}`}>
                    {loading || !data || !displayUser ? (
                        <ProfileSkeleton />
                    ) : (
                        <form onSubmit={handleSaveAllData}>
                            <div className="flex flex-col gap-6 md:gap-8">
                                <ProfileHeader
                                    key={`${displayUser.instagram}-${displayUser.website}-${displayUser.photo}`}
                                    user={displayUser}
                                    roleLabel="Cliente"
                                    isOwner={true}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing}
                                    onChangeData={handleHeaderChange}
                                />

                                <FormProfileClient
                                    data={{ ...data, user: displayUser }}
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
            <div className="bg-white p-8 rounded-[32px] border border-zinc-100 flex flex-col items-center sm:flex-row sm:justify-start gap-6">
                <div className="w-32 h-32 bg-zinc-200 rounded-full" />
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-zinc-200 rounded-lg w-48" />
                    <div className="h-4 bg-zinc-200 rounded-lg w-32" />
                </div>
            </div>
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
