import { cn } from "@/lib/utils";

interface LabelFormProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    title: string;
}

export default function LabelForm({ title, className, ...props }: LabelFormProps) {
    return (
        <label
            className={cn(
                "block text-base text-left font-bold mt-5 ml-1 font-sans",
                className
            )}
            {...props}
        >
            {title}
        </label>
    );
}
