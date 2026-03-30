import NavbarPage from "../../components/record/ui/navbar-page";
import FormProfileClient from "@/components/client/profile/profile-client-form";
import ProfileClientAvatar from "@/components/client/profile/profile-client-avatar";
import { clientLinksNavbar } from "@/routes/frontend-routes";
import { useClientProfile } from "@/hooks/user-client-profile";
import { useState } from "react";


export default function ProfileClient() {

    const storedUser = JSON.parse(localStorage.getItem("user") || "null")
    const [isEditing, setIsEditing] = useState(false);
    const { data, loading, handleChange, handleSubmit } = useClientProfile(storedUser?.id)

    if (loading || !data) return <p className="text-center p-10">Carregando...</p>

    return (
        <div className="min-h-screen bg-[#F3EDE2]">
            <NavbarPage title="Central do Cliente" shortTitle="C" links={clientLinksNavbar} />
            <main className="max-w-5xl mx-auto py-10 px-6">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <ProfileClientAvatar />
                    <FormProfileClient
                        data={data}
                        handleChange={handleChange}
                        onSubmit={handleSubmit}
                    />
                </div>
            </main>
        </div>
    );
}
