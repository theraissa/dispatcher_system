import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode; // Permite passar um ícone do Lucide
    rightElement?: ReactNode; // Para o botão de "olho" da senha
}

export default function InputForm({
    type,
    name,
    value,
    onChange,
    placeholder,
    readOnly,
    icon,
    rightElement,
    className,
    ...props
}: InputFormProps) {
    return (
        <div className="relative w-full group">
            {/* Ícone à esquerda, se existir */}
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-[#21314D]">
                    {icon}
                </div>
            )}

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                required
                className={cn(
                    // Estilos base (Inter e Tailwind)
                    "w-full h-11 text-base transition-all border outline-none font-sans",
                    "rounded-xl border-zinc-200 bg-white placeholder:text-zinc-300",
                    "focus:border-[#21314D] focus:ring-1 focus:ring-[#21314D]/20",

                    // Padding dinâmico baseado nos ícones
                    icon ? "pl-10" : "pl-4",
                    rightElement ? "pr-10" : "pr-4",

                    // Estilo para readOnly (substituindo o Styled Components)
                    readOnly && "bg-zinc-100 text-zinc-500 cursor-not-allowed border-zinc-200 shadow-none",

                    className // Permite sobrescrever estilos se necessário
                )}
                {...props}
            />

            {/* Elemento à direita (ex: botão de mostrar senha) */}
            {rightElement && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {rightElement}
                </div>
            )}
        </div>
    );
}
