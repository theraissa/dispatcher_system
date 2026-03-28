import { Paperclip } from "lucide-react"; // Um ícone de clipe combina muito aqui
import { cn } from "@/lib/utils";

export default function ButtonAppendForm({ title, className }: { title: string, className?: string }) {
    return (
        <button
            type="button"
            className={cn(
                "flex justify-center items-center gap-2",
                "mx-auto my-8 w-full md:w-[60%] p-3",
                "bg-zinc-100 text-zinc-700 border-2 border-dashed border-zinc-300",
                "rounded-xl font-bold text-sm transition-all",
                "hover:bg-zinc-200 hover:border-zinc-400 active:scale-95",
                className
            )}
        >
            <Paperclip size={18} />
            {title}
        </button>
    )
}
