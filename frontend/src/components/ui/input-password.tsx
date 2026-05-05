import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import InputForm from "../record/ui/input-form";

interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    readOnly?: boolean;
}

export default function InputPassword({ readOnly, ...props }: InputPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <InputForm
                {...props}
                type={showPassword ? "text" : "password"}
                icon={props.icon || <Lock size={18} />} // Lock por padrão se não enviar outro
                readOnly={readOnly}
                rightElement={
                    /* Só mostra o botão se não for readOnly */
                    !readOnly && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-zinc-400 hover:text-[#21314D] transition-colors p-1"
                            tabIndex={-1} // Evita que o Tab pare no ícone, facilitando a digitação
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )
                }
            />
        </div>
    );
}
