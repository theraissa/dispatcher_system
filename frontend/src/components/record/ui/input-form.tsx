import { cn } from "@/lib/utils";
import type { ReactNode } from "react";


interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode; // Permite passar um ícone do Lucide
    rightElement?: ReactNode; // Para o botão de "olho" da senha
}

/**
 * Input padronizado com suporte a ícones e estados (readonly/focus).
 */
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
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#21314D] transition-colors">
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
                maxLength={50}
                required
                className={cn(
                    "w-full h-11 text-base transition-all border outline-none rounded-xl",
                    "border-zinc-200 bg-white placeholder:text-zinc-300",
                    "focus:border-[#21314D] focus:ring-1 focus:ring-[#21314D]/20",
                    // Ajuste de cursor e cor para campos bloqueados
                    readOnly && "bg-zinc-50 text-zinc-400 cursor-not-allowed border-zinc-200",
                    icon ? "pl-10" : "pl-4",
                    rightElement ? "pr-10" : "pr-4",
                    className
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
