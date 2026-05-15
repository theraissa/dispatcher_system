import InlineField from "@/components/layout/inline-field-form";
import InlineFields from "@/components/layout/inline-fields-form";
import { CommandForm } from "@/components/record/ui/command-form";
import InputForm from "@/components/record/ui/input-form";
import LabelForm from "@/components/record/ui/label-form";
import InputPassword from "@/components/ui/input-password";
import { Separator } from "@/components/ui/separator";
import TitleTemplate from "@/components/ui/title";
import { ESTADOS_BR } from "@/utils/constants";
import { cpfMask, phoneMask, zipCodeMask } from "@/utils/masks";
import { Calendar, CreditCard, Hash, Lock, Mail, MapPin, Milestone, Navigation, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";


/**
 * Props do formulário de perfil do cliente.
 *
 * @property data - Dados atuais do usuário e endereço
 * @property handleChange - Função genérica para atualizar campos do formulário
 * @property isEditing - Define se o formulário está em modo edição
 */
type FormProfileClientProps = {
    data: {
        user: Record<string, any>;
        address: Record<string, any>;
    };
    handleChange: (
        entity: "user" | "address",
        field: any,
        value: any
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

    const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Efeito para carregar cidades quando o Estado (UF) mudar
    useEffect(() => {
        if (!data.address?.state) {
            setCities([]);
            return;
        }

        async function fetchCities() {
            setLoadingCities(true);
            try {
                const response = await fetch(
                    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.address.state}/municipios?orderBy=nome`
                );
                const result = await response.json();

                const formattedCities = result.map((city: any) => ({
                    value: city.nome,
                    label: city.nome,
                }));

                setCities(formattedCities);
            } catch (error) {
                console.error("Erro ao carregar cidades:", error);
            } finally {
                setLoadingCities(false);
            }
        }

        fetchCities();
    }, [data.address?.state]);

    return (
        <section className="flex-1 bg-white p-6 md:p-12 rounded-[24px] md:rounded-[32px] border border-zinc-100 shadow-sm">

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
                        value={cpfMask(data.user.cpf)}
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

            <Separator className="my-8 opacity-100" />

            {/* CONTATO E LOGIN */}
            <TitleTemplate title="Contato e Login" />

            <InlineFields>
                <InlineField>
                    <LabelForm title="Telefone / WhatsApp" />
                    <InputForm
                        name="contact"
                        icon={<Phone size={18} />}
                        value={phoneMask(data.user.contact)}
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
                        value={phoneMask(data.address?.contact)}
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
                        <InputPassword
                            name="password"
                            icon={<Lock size={18} />}
                            value={data.user.password || ""}
                            onChange={onInputChange("user")}
                            placeholder="••••••••"
                        />
                    </InlineField>
                    <InlineField>
                        <LabelForm title="Confirmar Senha" />
                        <InputPassword
                            name="confirm_password"
                            icon={<Lock size={18} />}
                            placeholder="••••••••"
                        />
                    </InlineField>
                </InlineFields>
            )}

            <Separator className="my-10 opacity-100" />

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
                        value={zipCodeMask(data.address?.zip_code || "")}
                        onChange={onInputChange("address")}
                        placeholder="00000-000"
                        readOnly={!isEditing}
                    />
                </InlineField>
            </InlineFields>

            {/* CAMPOS DE CIDADE E ESTADO ATUALIZADOS */}
            <InlineFields>
                <InlineField className="md:flex-[0.4]">
                    <LabelForm title="Estado (UF)" />
                    <CommandForm
                        type="state"
                        options={ESTADOS_BR}
                        value={data.address?.state || ""}
                        placeholder="UF"
                        disabled={!isEditing}
                        onChange={(val) => {
                            // Atualiza o estado
                            handleChange("address", "state", val);
                            // Limpa a cidade para obrigar nova seleção compatível
                            handleChange("address", "city", "");
                        }}
                    />
                </InlineField>

                <InlineField>
                    <LabelForm title="Cidade" />
                    <CommandForm
                        type="city"
                        options={cities}
                        value={data.address?.city || ""}
                        placeholder={loadingCities ? "Carregando..." : "Selecione a cidade"}
                        disabled={!isEditing || !data.address?.state || loadingCities}
                        onChange={(val) => handleChange("address", "city", val)}
                    />
                </InlineField>
            </InlineFields>
        </section>
    );
}
