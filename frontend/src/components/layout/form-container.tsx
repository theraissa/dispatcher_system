export default function FormsContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col lg:flex-row justify-center items-start gap-10 mt-12 flex-wrap w-full px-4">
            {children}
        </div>
    )
}
