import { cn } from "@/lib/utils";

interface LabelFormProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    title: string;
}

export default function LabelForm({ title, className, ...props }: LabelFormProps) {
    return (
        <label
            className={cn(
                "block text-sm md:text-base text-left font-bold mt-4 mb-1.5 ml-1 text-zinc-700",
                className
            )}
            {...props}
        >
            {title}
        </label>
    );
}
