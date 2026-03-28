import { cn } from "@/lib/utils";

interface SectionFormProps {
    children: React.ReactNode;
    className?: string;
}

export default function SectionForm({ children, className }: SectionFormProps) {
    return (
        <section className={cn(
            "w-full max-w-[700px] bg-white p-8 lg:p-12",
            "rounded-[40px] shadow-sm border-none",
            "transition-all duration-300",
            className
        )}>
            {children}
        </section>
    );
}
