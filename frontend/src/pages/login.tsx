import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLogin } from "../hooks/use-login";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import Navbar from "../components/record/ui/navbar-with-title";
import { Card, CardContent } from "../components/ui/card";
import LabelForm from "../components/record/ui/label-form";
import InputForm from "../components/record/ui/input-form";
import ButtonSubmitForm from "../components/record/ui/button-submit-form";

export default function Login() {
    const location = useLocation();
    const { login, error, loading } = useLogin();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        password: "",
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        login(formData);
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F3EDE2]">
            <Navbar title="Login" />

            <main className="flex-1 flex items-start justify-center pt-40 px-4">
                <Card className="w-full max-w-[500px] border-none shadow-sm rounded-[40px] py-8 px-4">
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-2 bg-red-50 border border-red-200 rounded-md text-center">
                                    <span className="text-xs text-red-600 font-medium">{error}</span>
                                </div>
                            )}

                            {/* Campo de Email */}
                            <div className="space-y-1">
                                <LabelForm title="Email" />
                                <div className="relative">
                                    <InputForm
                                        type="text"
                                        name="email"
                                        icon={<Mail size={18} />}
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Digite seu nome completo"
                                        readOnly={false}
                                    />
                                </div>
                            </div>

                            {/* Campo de Senha */}
                            <div>
                                <LabelForm title="Senha" />
                                <div className="relative">
                                    <InputForm
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        icon={<Lock size={18} />}
                                        value={formData.password}
                                        onChange={handleChange}
                                        readOnly={false}
                                    />
                                    {/* Botão de Mostrar/Esconder */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-center">
                                <ButtonSubmitForm
                                    title="Acessar"
                                    loading={loading}
                                    className="!max-w-[200px] !text-base !mt-0 shadow-md"
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div >
    );
}
