export default function InlineFields({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row gap-5 w-full">
            {children}
        </div>
    );
}
