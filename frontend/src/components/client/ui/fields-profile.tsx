import { cn } from "@/lib/utils";

// --- LABEL ---
export function FormLabel({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <label className={cn("text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1.5 block", className)}>
            {children}
        </label>
    );
}

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export function FormInput({ className, ...props }: InputProps) {
    return (
        <input
            {...props}
            className={cn(
                "w-full h-11 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none transition-all",
                "placeholder:text-zinc-300 focus:bg-white focus:border-[#21314D] focus:ring-4 focus:ring-[#21314D]/5",
                className
            )}
        />
    );
}

// --- SEÇÃO ---
interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export function FormSection({ title, icon, children }: SectionProps) {
    return (
        <div className="mb-12">
            <h3 className="text-lg font-extrabold text-[#1E1E1E] tracking-tight mb-6 flex items-center gap-2">
                <span className="text-[#21314D]">{icon}</span>
                {title}
            </h3>
            {children}
        </div>
    );
}
