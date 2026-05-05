import { cn } from "@/lib/utils";

export default function SelectForm({ options, placeholder = "Selecione", className, ...props }: any) {
    return (
        <select
            className={cn(
                "w-full h-11 text-base transition-all border outline-none rounded-xl px-4 appearance-none bg-white",
                "border-zinc-200 focus:border-[#21314D] focus:ring-1 focus:ring-[#21314D]/20",
                "disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        >
            <option value="">{placeholder}</option>
            {options?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
