import { useState } from "react"

import FormPersonal from "../../record/dispatcher-record/form-dispatcher/form-personal"
import FormCommercial from "../../record/dispatcher-record/form-dispatcher/form-commercial"
import ProfileHeader from "./profile-header"
import FormsContainer from "../../layout/form-container"


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

    return (
        <>
            <ProfileHeader user={user} />

            <FormsContainer>
                <FormPersonal
                    user={user}
                    onChange={handleChange}
                />

                <FormCommercial
                    dispatcher={dispatcher}
                    office={office}
                    onChange={handleChange}
                />
            </FormsContainer>
        </>
    )
}   
