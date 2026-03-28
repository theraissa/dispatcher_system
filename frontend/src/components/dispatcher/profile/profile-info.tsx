import { useState } from "react";
import { useDispatcherProfile } from "@/hooks/use-dispatcher-profile";

import FormPersonal from "@/components/record/dispatcher-record/form-dispatcher/form-personal";
import ProfileHeader from "./profile-header";
import FormCommercial from "@/components/record/dispatcher-record/form-dispatcher/form-commercial";

export default function ProfileInfo() {
    const [isEditing, setIsEditing] = useState(false);
    const storedUser = JSON.parse(localStorage.getItem("user") || "null")

    const { data, loading, handleChange, handleSubmit } = useDispatcherProfile(storedUser?.id)

    if (loading || !data) return <p className="text-center p-10">Carregando...</p>

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); setIsEditing(false); }}>

            <ProfileHeader
                user={data.user}
                profile={data.profile}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
            />

            {/* AJUSTE AQUI: flex-col para mobile e flex-row para telas grandes */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* Lado Esquerdo: Pessoal */}
                <div className="flex-1 w-full">
                    <FormPersonal
                        user={data.user}
                        onChange={handleChange}
                        readOnly={!isEditing}
                    />
                </div>

                {/* Lado Direito: Comercial */}
                <div className="flex-1 w-full">
                    <FormCommercial
                        dispatcher={data.dispatcher}
                        office={data.office}
                        onChange={handleChange}
                        readOnly={!isEditing}
                    />
                </div>
            </div>

            {/* Botão de Salvar flutuante */}
            {isEditing && (
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        Salvar Alterações
                    </button>
                </div>
            )}
        </form>
    )
}
