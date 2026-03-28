import { cn } from "@/lib/utils";

interface TitleTemplateProps {
    title: string;
    className?: string;
}

export default function TitleTemplate({ title, className }: TitleTemplateProps) {
    return (
        <h3 className={cn(
            "text-2xl font-bold text-center py-4 text-[#1E1E1E] font-sans tracking-tight",
            className
        )}>
            {title}
        </h3>
    );
}
