import { Mail } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLogin } from "../hooks/use-login";

import InputPassword from "@/components/ui/input-password";
import ButtonSubmitForm from "../components/record/ui/button-submit-form";
import InputForm from "../components/record/ui/input-form";
import LabelForm from "../components/record/ui/label-form";
import Navbar from "../components/record/ui/navbar-with-title";
import { Card, CardContent } from "../components/ui/card";

/**
 * Tela de Login Principal.
 * Inclui captura de e-mail via estado da navegação (vindo da Home)
 * e tratamento visual para diferentes tamanhos de tela.
 */
export default function Login() {
    const location = useLocation();
    const { login, error, loading } = useLogin();

    // Estado do formulário iniciando com o e-mail vindo da Home, se existir
    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        password: "",
    });

    /**
     * Atualiza o estado do formulário conforme o usuário digita.
     */
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    /**
     * Tenta realizar o login chamando o hook customizado.
     */
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        login(formData);
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F3EDE2]">

            {/* Navbar superior com título dinâmico */}
            <Navbar title="Login" />

            <main className="flex-1 flex items-start justify-center pt-12 md:pt-32 px-4 pb-12">

                {/* Card de Login: */}
                <Card className="w-full max-w-[450px] border-none shadow-sm rounded-[24px] md:rounded-[40px] py-6 md:py-10 px-2 md:px-4 bg-white">
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Mensagem de Erro: Feedback visual imediato */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center animate-in fade-in zoom-in duration-300">
                                    <span className="text-xs text-red-600 font-semibold">{error}</span>
                                </div>
                            )}

                            {/* Campo de Email */}
                            <div className="space-y-2">
                                <LabelForm title="Email" />
                                <div className="relative">
                                    <InputForm
                                        type="email"
                                        name="email"
                                        icon={<Mail size={18} className="text-zinc-400" />}
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="seu@email.com"
                                        readOnly={false}
                                    />
                                </div>
                            </div>

                            {/* Campo de Senha */}
                            <div className="space-y-2">
                                <LabelForm title="Senha" />
                                <InputPassword
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    readOnly={false}
                                />
                            </div>

                            {/* Ações do Formulário:*/}
                            <div className="pt-6 flex flex-col items-center gap-4">
                                <ButtonSubmitForm
                                    title="Acessar"
                                    loading={loading}
                                    className="!w-full md:!max-w-[240px] !h-12 !text-base shadow-md transition-transform active:scale-95"
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div >
    );
}
