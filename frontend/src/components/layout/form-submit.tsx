interface FormSubmitProps {
    onSubmit?: (event: React.FormEvent) => void;
    children: React.ReactNode;
}

export default function FormSubmit({ onSubmit, children }: FormSubmitProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col w-full items-center"
        >
            {children}
        </form>
    )
}
