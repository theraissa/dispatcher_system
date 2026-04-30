import { useDispatcherProfile } from "@/hooks/use-dispatcher-profile";
import { useState } from "react";

import FormCommercial from "@/components/record/dispatcher-record/form-dispatcher/form-commercial";
import FormPersonal from "@/components/record/dispatcher-record/form-dispatcher/form-personal";
import { Loader2 } from "lucide-react";
import ProfileHeader from "./profile-header";


/**
 * Componente responsável por exibir e editar as informações do perfil do despachante.
 *
 * Ele reúne dados pessoais, comerciais e de configuração do despacho,
 * permitindo edição controlada via estado interno.
 */
export default function ProfileInfo({ dispatcherId, userId }:
    { dispatcherId: number; userId: number }
) {

    //Controla se o usuário está em modo de edição ou apenas visualização.
    const [isEditing, setIsEditing] = useState(false);

    /**
     * Hook responsável por carregar e gerenciar os dados do perfil do despachante.
     *
     * Responsável por:
     * - Buscar dados do usuário e do despachante
     * - Controlar estado de loading
     * - Gerenciar mudanças nos campos do formulário
     * - Submeter atualizações do perfil
     */
    const {
        data,
        loading,
        handleChange,
        handleSubmit,
    } = useDispatcherProfile(userId, dispatcherId);

    if (loading || !data) {
        return (
            <div className="flex justify-center p-20 text-zinc-400">
                <Loader2 className="animate-spin mr-2" />
                Carregando perfil...
            </div>
        );
    }

    /**
     * Submissão do formulário de perfil.
     *
     * Fluxo:
     * 1. Evita reload padrão do formulário
     * 2. Envia dados atualizados via hook
     * 3. Sai do modo de edição após salvar
     */
    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        handleSubmit();
        setIsEditing(false);
    }

    return (
        <form onSubmit={handleFormSubmit}>

            {/* =========================
                HEADER DO PERFIL
                ========================= */}
            <ProfileHeader
                user={data.user}
                profile={data.profile}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
            />

            {/* =========================
                FORMULÁRIO PRINCIPAL
                ========================= */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* =========================
                    DADOS PESSOAIS
                ========================= */}
                <div className="flex-1 w-full">
                    <FormPersonal
                        user={data.user}
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
