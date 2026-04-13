import { User, Mail, MapPin } from "lucide-react";
import { FormInput, FormLabel, FormSection } from "../ui/fields-profile";
import type { Address, UserType } from "@/types/type";


/**
 * Props do formulário de perfil do cliente.
 *
 * @property data - Dados atuais do usuário e endereço
 * @property handleChange - Função genérica para atualizar campos do formulário
 * @property isEditing - Define se o formulário está em modo edição
 */
type FormProfileClientProps = {
    data: {
        user: UserType;
        address: Address;
    };
    handleChange: (
        entity: "user" | "address",
        field: string,
        value: string
    ) => void;
    isEditing: boolean;
};


/**
 * Componente responsável por exibir e editar os dados do perfil do cliente.
 *
 * Responsabilidades:
 * - Renderizar informações pessoais, contato e endereço
 * - Controlar modo de visualização vs edição
 * - Delegar alterações de campos via `handleChange`
 *
 * Comportamento:
 * - Quando `isEditing` é false → inputs ficam somente leitura
 * - Quando `isEditing` é true → inputs ficam editáveis
 */
export default function FormProfileClient({ data, handleChange, isEditing }: FormProfileClientProps) {

    return (
        <section className="flex-1 bg-white p-8 md:p-12 rounded-[40px] border border-zinc-100 shadow-sm">
            {/* INFORMAÇÕES PESSOAIS */}
            <FormSection title="Informações Pessoais" icon={<User size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <FormLabel>Nome Completo</FormLabel>
                        <FormInput
                            value={data.user.name}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("user", "name", e.target.value)}
                        />
                    </div>
                    <div>
                        <FormLabel>CPF</FormLabel>
                        <FormInput
                            value={data.user.cpf}
                            placeholder="000.000.000-00"
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("user", "cpf", e.target.value)}
                        />
                    </div>
                    <div>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormInput
                            type="date"
                            value={data.user.date_birth}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("user", "date_birth", e.target.value)}
                        />
                    </div>
                </div>
            </FormSection>

            {/* CONTATO E LOGIN */}
            <FormSection title="Contato e Login" icon={<Mail size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <FormLabel>Telefone / WhatsApp</FormLabel>
                        <FormInput
                            placeholder="(00) 00000-0000"
                            value={data.user.contact}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("user", "contact", e.target.value)}
                        />
                    </div>
                    <div>
                        <FormLabel>Telefone Residencial</FormLabel>
                        <FormInput
                            placeholder="(00) 0000-0000"
                            value={data.address?.contact || ""}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "contact", e.target.value)}
                        />
                    </div>
                    <div className={isEditing ? "md:col-span-2" : ""}>
                        <FormLabel>E-mail</FormLabel>
                        <FormInput
                            type="email"
                            placeholder="seu@email.com"
                            value={data.user.email}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("user", "email", e.target.value)}
                        />
                    </div>
                    {isEditing && (
                        <>
                            <div>
                                <FormLabel>Nova Senha</FormLabel>
                                <FormInput
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.user.password || ""}
                                    onChange={(e) => handleChange("user", "password", e.target.value)}
                                />
                            </div>
                            <div>
                                <FormLabel>Confirmar Senha</FormLabel>
                                <FormInput type="password" placeholder="••••••••" />
                            </div>
                        </>
                    )}
                </div>
            </FormSection>

            {/* ENDEREÇO RESIDENCIAL */}
            <FormSection title="Endereço Residencial" icon={<MapPin size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                    <div className="md:col-span-4">
                        <FormLabel>Rua / Logradouro</FormLabel>
                        <FormInput
                            placeholder="Nome da rua"
                            value={data.address?.address || ""}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "address", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FormLabel>Número</FormLabel>
                        <FormInput
                            placeholder="123"
                            value={data.address?.number || ""}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "number", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormLabel>Bairro</FormLabel>
                        <FormInput
                            placeholder="Seu bairro"
                            value={data.address?.neighborhood || ""}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "neighborhood", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormLabel>CEP</FormLabel>
                        <FormInput
                            placeholder="00000-000"
                            value={data.address?.zip_code || ""}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "zip_code", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <FormLabel>Cidade</FormLabel>
                        <FormInput
                            placeholder="Sua cidade"
                            value={data.address?.city || ""}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "city", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FormLabel>Estado (UF)</FormLabel>
                        <FormInput
                            placeholder="RS"
                            value={data.address?.state || ""}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "state", e.target.value)}
                        />
                    </div>
                </div>
            </FormSection>
        </section>
    );
}
