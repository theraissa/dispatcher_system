import { useDispatcherProfile } from "@/hooks/use-dispatcher-profile";
import { useUpdateClientProfilePublic } from "@/hooks/use-user-profile-public"; // Importado para salvar os dados públicos
import { useState } from "react";

import FormCommercial from "@/components/record/dispatcher-record/form-dispatcher/form-commercial";
import FormPersonal from "@/components/record/dispatcher-record/form-dispatcher/form-personal";
import { Loader2 } from "lucide-react";
import ProfileHeader from "../../layout/profile-header";

/**
 * Componente responsável por exibir e editar as informações do perfil do despachante.
 */
export default function ProfileInfo({ dispatcherId, userId }:
    { dispatcherId: number; userId: number }
) {
    const [isEditing, setIsEditing] = useState(false);

    // Hook de dados internos do formulário (Pessoais/Comerciais)
    const {
        data,
        loading,
        handleChange,
        handleSubmit,
    } = useDispatcherProfile(userId, dispatcherId);

    // Hook para salvar os dados públicos (Instagram, Website, Foto)
    const { updateProfile, isLoading: isUpdatingPublic } = useUpdateClientProfilePublic();

    // Estado para segurar o que o usuário alterou no Header ENQUANTO edita
    const [pendingPublicData, setPendingPublicData] = useState<{
        instagram?: string;
        website?: string;
        photoFile?: File;
    } | null>(null);

    // Estado definitivo para refletir o retorno do banco na tela imediatamente
    const [publicDataOverride, setPublicDataOverride] = useState<{
        instagram?: string;
        website?: string;
        photo?: string;
    } | null>(null);

    if (loading || !data) {
        return (
            <div className="flex justify-center p-20 text-zinc-400">
                <Loader2 className="animate-spin mr-2" />
                Carregando perfil...
            </div>
        );
    }

    // Captura as mudanças de digitação/foto vindas do Header em tempo real
    const handleHeaderChange = (newPublicData: { instagram?: string; website?: string; photoFile?: File }) => {
        setPendingPublicData(newPublicData);
    };

    /**
     * Submissão unificada do formulário de perfil (Dados Internos + Públicos).
     */
    async function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!userId) return;

        try {
            // Cria a lista de requisições paralelas
            const promises: Promise<any>[] = [handleSubmit()]; // 1. Envia dados pessoais/comerciais do hook principal

            // 2. Se houver alterações no cabeçalho, anexa a requisição pública na fila
            if (pendingPublicData) {
                promises.push(
                    updateProfile(userId.toString(), {
                        instagram: pendingPublicData.instagram || "",
                        website: pendingPublicData.website || "",
                        photo: pendingPublicData.photoFile ?? ""
                    })
                );
            }

            // Executa tudo junto
            const results = await Promise.all(promises);
            const updatedPublicData = results[1]; // Resposta da rota pública

            if (updatedPublicData) {
                setPublicDataOverride({
                    instagram: updatedPublicData.instagram,
                    website: updatedPublicData.website,
                    photo: updatedPublicData.photo,
                });

                // Atualiza o localStorage para manter a foto sincronizada no sistema
                const storedUser = JSON.parse(localStorage.getItem("user") || "null");
                if (storedUser) {
                    const newUserLocalStorage = { ...storedUser, photo: updatedPublicData.photo };
                    localStorage.setItem("user", JSON.stringify(newUserLocalStorage));
                }
            }

            // Limpa os estados temporários e fecha o modo de edição global
            setPendingPublicData(null);
            setIsEditing(false);

        } catch (error) {
            console.error("Erro ao salvar perfil do despachante:", error);
        }
    }

    // Mescla perfeitamente os dados originais do banco com os overrides salvos
    const displayUser = data.user ? {
        ...data.user,
        instagram: publicDataOverride?.instagram ?? data.user.instagram,
        website: publicDataOverride?.website ?? data.user.website,
        photo: publicDataOverride?.photo ?? data.user.photo,
    } : null;

    return (
        // Efeito visual de fade enquanto salva/carrega as fotos
        <form onSubmit={handleFormSubmit} className={`transition-opacity duration-500 ${isUpdatingPublic ? 'opacity-70' : 'opacity-100'}`}>

            {/* =========================
                HEADER DO PERFIL
                ========================= */}
            {displayUser && (
                <ProfileHeader
                    // KEY Inteligente: Evita loops e força o reset perfeito do componente ao salvar
                    key={`${displayUser.instagram}-${displayUser.website}-${displayUser.photo}`}
                    user={displayUser}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    isOwner={true}
                    roleLabel="Despachante Documentalista de Trânsito"
                    onChangeData={handleHeaderChange} // Passa o novo manipulador de alterações
                />
            )}

            {/* =========================
                FORMULÁRIO PRINCIPAL
                ========================= */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* =========================
                    DADOS PESSOAIS
                ========================= */}
                <div className="flex-1 w-full">
                    <FormPersonal
                        user={data.user ? { ...data.user, ...publicDataOverride } : data.user}
                        onChange={handleChange}
                        readOnly={!isEditing}
                    />
                </div>

                {/* =========================
                    DADOS COMERCIAIS
                ========================= */}
                <div className="flex-1 w-full">
                    <FormCommercial
                        dispatcher={data.dispatcher}
                        office={data.office}
                        onChange={handleChange}
                        readOnly={!isEditing}
                    />
                </div>
            </div>
        </form>
    );
}
