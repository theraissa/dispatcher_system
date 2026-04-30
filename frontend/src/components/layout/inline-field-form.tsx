type InlineFieldProps = {
    children: React.ReactNode;
    className?: string;
};

export default function InlineField({ children, className }: InlineFieldProps) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}
