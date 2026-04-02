import { User, Mail, MapPin } from "lucide-react";
import { FormInput, FormLabel, FormSection } from "../ui/fields-profile";

export default function FormProfileClient({ data, handleChange, isEditing }) {

    return (
        < section className="flex-1 bg-white p-8 md:p-12 rounded-[40px] border border-zinc-100 shadow-sm" >
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
                            onChange={(e) => handleChange("user", "cpf", e.target.value)}
                        />
                    </div>
                    <div>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <div className="flex gap-2">
                            <FormInput
                                value={data.user.date_birth}
                                placeholder="DD/MM/AAAA"
                                readOnly={!isEditing}
                                className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                                onChange={(e) => handleChange("user", "date_birth", e.target.value)}
                            />
                            <button className="whitespace-nowrap bg-zinc-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all">
                                Anexar RG
                            </button>
                        </div>
                    </div>
                </div>
            </FormSection>

            <FormSection title="Contato e Login" icon={<Mail size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <FormLabel>Telefone Celular</FormLabel>
                        <FormInput
                            placeholder="(00) 00000-0000"
                            value={data.user.contact}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("user", "contact", e.target.value)}
                        />
                    </div>
                    <div>
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
                    <div>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormInput
                            type="password"
                            placeholder="••••••••"
                            value={data.user.password}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("user", "password", e.target.value)}
                        />
                    </div>
                    <div>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormInput type="password" placeholder="••••••••" />
                    </div>
                </div>
            </FormSection>

            <FormSection title="Endereço Residencial" icon={<MapPin size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                    <div className="md:col-span-4">
                        <FormLabel>Rua / Logradouro</FormLabel>
                        <FormInput
                            placeholder="Nome da rua"
                            value={data.address?.address ?? " "}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "address", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FormLabel>Número</FormLabel>
                        <FormInput placeholder="123"
                            value={data.address?.number ?? " "}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "number", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormLabel>Bairro</FormLabel>
                        <FormInput
                            placeholder="Seu bairro"
                            value={data.address?.neighborhood ?? " "}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "neighborhood", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormLabel>CEP</FormLabel>
                        <FormInput
                            placeholder="00000-000"
                            value={data.address?.zip_code ?? " "}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-zinc-50 border-transparent cursor-not-allowed" : ""}
                            onChange={(e) => handleChange("address", "zip_code", e.target.value)}
                        />
                    </div>
                </div>
            </FormSection>
        </section >
    );
}
