import { cn } from "@/lib/utils";

/**
 * Organiza dois ou mais campos na mesma linha no desktop.
 * No mobile: os campos empilham verticalmente (flex-col).
 */
export default function InlineFields({ children }: { children: React.ReactNode }) {
    return (
        <div className={cn(
            "flex flex-col md:flex-row gap-4 md:gap-5 w-full",
            // Força os filhos diretos (InlineField) a terem o mesmo tamanho no desktop
            "[&>*]:flex-1"
        )}>
            {children}
        </div>
    );
}
