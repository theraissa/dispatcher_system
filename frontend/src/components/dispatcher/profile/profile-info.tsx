import { useEffect, useState } from "react"

import FormPersonal from "../../record/dispatcher-record/form-dispatcher/form-personal"
import FormCommercial from "../../record/dispatcher-record/form-dispatcher/form-commercial"
import ProfileHeader from "./profile-header"
import FormsContainer from "../../layout/form-container"
import FormSubmit from "../../layout/form-submit"

export default function ProfileInfo() {

    const [user, setUser] = useState({
        name: "",
        cpf: "",
        rg: "",
        date_birth: "",
        contact: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    const [dispatcher, setDispatcher] = useState({
        regis_crdd: "",
        date_exp_regis: ""
    })

    const [office, setOffice] = useState({
        contact: "",
        address: "",
        number: "",
        neighborhood: "",
        zip_code: "",
        city: "",
        state: ""
    })

    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    // Obtém o ID do despachante, caso não consiga, encaminha para o login  
    const [storedUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user") || "null")
    })
    useEffect(() => {
        if (!storedUser?.id) {
            setLoading(false)
            return
        }
        async function fetchProfile() {
            try {

                const response = await fetch(
                    `http://localhost:5000/api/dispatcher-system/dispatcher/${storedUser.id}`
                )
                const data = await response.json()

                setUser({
                    name: data.user?.name || "",
                    cpf: data.user?.cpf || "",
                    rg: data.user?.rg || "",
                    date_birth: data.user?.date_birth || "",
                    contact: data.user?.contact || "",
                    email: data.user?.email || "",
                    password: data.user?.password || "",
                    confirm_password: ""
                })
                setDispatcher({
                    regis_crdd: data.dispatcher?.regis_crdd || "",
                    date_exp_regis: data.dispatcher?.date_exp_regis || ""
                })
                setOffice({
                    contact: data.office?.contact || "",
                    address: data.office?.address || "",
                    number: data.office?.number || "",
                    neighborhood: data.office?.neighborhood || "",
                    zip_code: data.office?.zip_code || "",
                    city: data.office?.city || "",
                    state: data.office?.state || ""
                })

            } catch (error) {
                console.error("Erro ao carregar perfil:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [storedUser])

    function handleChange(entity: string, field: string, value: string) {
        if (entity === "user") {
            setUser(prev => ({ ...prev, [field]: value }))
        }
        if (entity === "dispatcher") {
            setDispatcher(prev => ({ ...prev, [field]: value }))
        }
        if (entity === "office") {
            setOffice(prev => ({ ...prev, [field]: value }))
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        console.log("Salvar edição futuramente")
    }

    if (loading) {
        return <p>Carregando...</p>
    }

    return (
        <FormSubmit onSubmit={handleSubmit}>
            <ProfileHeader
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
            />

            <FormsContainer>
                <FormPersonal
                    user={user}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />

                <FormCommercial
                    dispatcher={dispatcher}
                    office={office}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
            </FormsContainer>
        </FormSubmit>
    )
}
