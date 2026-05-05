import { cn } from "@/lib/utils";

interface SectionFormProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Moldura branca arredondada para as seções do formulário.
 * Ajustada para ser flexível dentro do FormsContainer.
 */
export default function SectionForm({ children, className }: SectionFormProps) {
    return (
        <section className={cn(
            // Removi o max-w fixo de 700px para o FormsContainer controlar
            "w-full bg-white p-6 md:p-10 lg:p-12",
            "rounded-[24px] md:rounded-[40px] shadow-sm border-none",
            "transition-all duration-300",
            className
        )}>
            {children}
        </section>
    );
}
