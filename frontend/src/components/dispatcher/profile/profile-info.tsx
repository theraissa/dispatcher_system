import { useDispatcherProfile } from "../../../hooks/use-dispatcher-profile"

import FormSubmit from "../../layout/form-submit"
import ProfileHeader from "./profile-header"
import FormsContainer from "../../layout/form-container"
import FormCommercial from "../../record/dispatcher-record/form-dispatcher/form-commercial"
import FormPersonal from "../../record/dispatcher-record/form-dispatcher/form-personal"


export default function ProfileInfo() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null")

    const {
        data,
        loading,
        handleChange,
        handleSubmit
    } = useDispatcherProfile(storedUser?.id)

    if (loading || !data) {
        return <p>Carregando...</p>
    }

    return (
        <FormSubmit onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
        }}>
            <ProfileHeader
                user={data.user}
                profile={data.profile}
            />

            <FormsContainer>
                <FormPersonal
                    user={data.user}
                    onChange={handleChange}
                />

                <FormCommercial
                    dispatcher={data.dispatcher}
                    office={data.office}
                    onChange={handleChange}
                />
            </FormsContainer>
        </FormSubmit>
    )
}
