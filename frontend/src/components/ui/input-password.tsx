import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import InputForm from "../record/ui/input-form";

interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    readOnly?: boolean;
}

export default function InputPassword({ readOnly, ...props }: InputPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);

    // ESTADO CHAVE: Começa como falso para o navegador achar que é um input de texto comum
    const [hasInteracted, setHasInteracted] = useState(false);

    // Define o tipo real baseado na interação do usuário
    // Se ele nunca clicou/digitou, mandamos "text". 
    // Assim que ele interagir, respeitamos o botão de "olhinho" (showPassword)
    const currentType = !hasInteracted
        ? "text"
        : (showPassword ? "text" : "password");

    return (
        <div className="relative w-full">
            <InputForm
                {...props}
                type={currentType}

                // Captura o momento em que o usuário foca ou digita para ativar o comportamento de senha
                onFocus={(e) => {
                    setHasInteracted(true);
                    props.onFocus?.(e);
                }}
                onChange={(e) => {
                    setHasInteracted(true);
                    props.onChange?.(e);
                }}

                // Mantém a estilização de bolinhas de senha mesmo quando o navegador finge ser texto
                className={`${props.className || ""} ${!hasInteracted && !showPassword ? "[text-security:disc] [-webkit-text-security:disc]" : ""}`}

                icon={props.icon || <Lock size={18} />}
                readOnly={readOnly}
                rightElement={
                    !readOnly && (
                        <button
                            type="button"
                            onClick={() => {
                                setHasInteracted(true); // Garante a ativação ao clicar no olho
                                setShowPassword(!showPassword);
                            }}
                            className="text-zinc-400 hover:text-[#21314D] transition-colors p-1"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )
                }
            />
        </div>
    );
}
