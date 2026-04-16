import { User, Mail, MapPin, CreditCard, Calendar, Phone, Lock, Hash, Milestone, Navigation, Globe } from "lucide-react";
import type { Address, UserType } from "@/types/type";
import TitleTemplate from "@/components/ui/title";
import LabelForm from "@/components/record/ui/label-form";
import InputForm from "@/components/record/ui/input-form";
import InlineFields from "@/components/layout/inline-fields-form";
import InlineField from "@/components/layout/inline-field-form";


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

    // Função auxiliar para adaptar o evento do InputForm ao seu handleChange original
    const onInputChange = (entity: "user" | "address") => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleChange(entity, name, value);
    };

    return (
        <section className="flex-1 bg-white md:p-12 rounded-[32px] border border-zinc-100 shadow-sm">

            {/* INFORMAÇÕES PESSOAIS */}
            <TitleTemplate title="Informações Pessoais" />

            <LabelForm title="Nome Completo" />
            <InputForm
                name="name"
                icon={<User size={18} />}
                value={data.user.name}
                onChange={onInputChange("user")}
                placeholder="Digite seu nome completo"
                readOnly={!isEditing}
            />

            <InlineFields>
                <InlineField>
                    <LabelForm title="CPF" />
                    <InputForm
                        name="cpf"
                        icon={<CreditCard size={18} />}
                        value={data.user.cpf}
                        onChange={onInputChange("user")}
                        placeholder="000.000.000-00"
                        readOnly={!isEditing}
                    />
                </InlineField>
                <InlineField>
                    <LabelForm title="Data de Nascimento" />
                    <InputForm
                        type="date"
                        name="date_birth"
                        icon={<Calendar size={18} />}
                        value={data.user.date_birth}
                        onChange={onInputChange("user")}
                        readOnly={!isEditing}
                    />
                </InlineField>
            </InlineFields>

            <hr className="border-zinc-100 my-8" />

            {/* CONTATO E LOGIN */}
            <TitleTemplate title="Contato e Login" />

            <InlineFields>
                <InlineField>
                    <LabelForm title="Telefone / WhatsApp" />
                    <InputForm
                        name="contact"
                        icon={<Phone size={18} />}
                        value={data.user.contact}
                        onChange={onInputChange("user")}
                        placeholder="(00) 00000-0000"
                        readOnly={!isEditing}
                    />
                </InlineField>
                <InlineField>
                    <LabelForm title="Telefone Residencial" />
                    <InputForm
                        name="contact"
                        icon={<Phone size={18} />}
                        value={data.address?.contact || ""}
                        onChange={onInputChange("address")}
                        placeholder="(00) 0000-0000"
                        readOnly={!isEditing}
                    />
                </InlineField>
            </InlineFields>

            <LabelForm title="E-mail" />
            <InputForm
                type="email"
                name="email"
                icon={<Mail size={18} />}
                value={data.user.email}
                onChange={onInputChange("user")}
                placeholder="seu@email.com"
                readOnly={!isEditing}
            />

            {isEditing && (
                <InlineFields>
                    <InlineField>
                        <LabelForm title="Nova Senha" />
                        <InputForm
                            type="password"
                            name="password"
                            icon={<Lock size={18} />}
                            value={data.user.password || ""}
                            onChange={onInputChange("user")}
                            placeholder="••••••••"
                        />
                    </InlineField>
                    <InlineField>
                        <LabelForm title="Confirmar Senha" />
                        <InputForm
                            type="password"
                            name="confirm_password"
                            icon={<Lock size={18} />}
                            placeholder="••••••••"
                        />
                    </InlineField>
                </InlineFields>
            )}

            <hr className="border-zinc-100 my-8" />

            {/* ENDEREÇO RESIDENCIAL */}
            <TitleTemplate title="Endereço Residencial" />

            <InlineFields>
                <InlineField>
                    <LabelForm title="Rua / Logradouro" />
                    <InputForm
                        name="address"
                        icon={<MapPin size={18} />}
                        value={data.address?.address || ""}
                        onChange={onInputChange("address")}
                        placeholder="Nome da rua"
                        readOnly={!isEditing}
                    />
                </InlineField>
                <InlineField>
                    <LabelForm title="Número" />
                    <InputForm
                        name="number"
                        icon={<Hash size={18} />}
                        value={data.address?.number || ""}
                        onChange={onInputChange("address")}
                        placeholder="123"
                        readOnly={!isEditing}
                    />
                </InlineField>
            </InlineFields>

            <InlineFields>
                <InlineField>
                    <LabelForm title="Bairro" />
                    <InputForm
                        name="neighborhood"
                        icon={<Navigation size={18} />}
                        value={data.address?.neighborhood || ""}
                        onChange={onInputChange("address")}
                        placeholder="Seu bairro"
                        readOnly={!isEditing}
                    />
                </InlineField>
                <InlineField>
                    <LabelForm title="CEP" />
                    <InputForm
                        name="zip_code"
                        icon={<Milestone size={18} />}
                        value={data.address?.zip_code || ""}
                        onChange={onInputChange("address")}
                        placeholder="00000-000"
                        readOnly={!isEditing}
                    />
                </InlineField>
            </InlineFields>

            <InlineFields>
                <InlineField>
                    <LabelForm title="Cidade" />
                    <InputForm
                        name="city"
                        icon={<Globe size={18} />}
                        value={data.address?.city || ""}
                        onChange={onInputChange("address")}
                        placeholder="Sua cidade"
                        readOnly={!isEditing}
                    />
                </InlineField>
                <InlineField>
                    <LabelForm title="Estado (UF)" />
                    <InputForm
                        name="state"
                        value={data.address?.state || ""}
                        onChange={onInputChange("address")}
                        placeholder="RS"
                        maxLength={2}
                        readOnly={!isEditing}
                    />
                </InlineField>
            </InlineFields>
        </section>
    );
}
