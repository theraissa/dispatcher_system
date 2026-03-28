

export function ProfileContainer({ children }: { children: React.ReactNode }) {
    return <div className="w-full flex justify-center py-6">{children}</div>;
}


export function ProfileCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100 flex flex-col gap-6 transition-all">
            {children}
        </div>
    );
}


export function ProfileCardHeader({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
            {children}
        </div>
    );
}
