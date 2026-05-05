import { cn } from "@/lib/utils";

/**
 * Container que organiza os blocos de formulário.
 * No mobile: Empilha verticalmente.
 * No desktop (lg): Coloca lado a lado, centralizado.
 */
export default function FormsContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className={cn(
            "flex flex-col lg:flex-row justify-center items-start",
            "gap-6 lg:gap-16", // Aumentei o gap para dar mais respiro entre os dois blocos
            "mt-8 md:mt-12",
            "w-full px-4 md:px-8 max-w-[1400px] mx-auto", // Aumentei o max-width total da página

            /* 
               AJUSTE DE LARGURA:
               - [&>*]:lg:flex-1: Faz os forms tentarem ocupar o máximo de espaço igual.
               - [&>*]:lg:max-w-[700px]: Aumentamos de 550px para 700px. 
               Isso permite que cada formulário seja bem mais largo no desktop.
            */
            "[&>*]:w-full [&>*]:lg:flex-1 [&>*]:lg:max-w-[700px]"
        )}>
            {children}
        </div>
    )
}
