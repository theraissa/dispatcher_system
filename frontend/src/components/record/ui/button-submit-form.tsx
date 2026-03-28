import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonSubmitFormProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  loading?: boolean;
}

export default function ButtonSubmitForm({
  title,
  loading,
  className,
  ...props
}: ButtonSubmitFormProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "w-full max-w-[500px] h-12 mt-6 px-4 py-2 flex items-center justify-center mx-auto",
        "bg-[#2D2D2D] text-white text-lg font-semibold rounded-xl transition-all",
        "hover:bg-[#1A1A1A] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed",
        "shadow-sm font-sans",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Carregando...
        </>
      ) : (
        title
      )}
    </button>
  );
}
