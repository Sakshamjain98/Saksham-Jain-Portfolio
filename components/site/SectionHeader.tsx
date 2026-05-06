export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={`text-center max-w-3xl mx-auto ${className ?? ""}`}>
      {eyebrow && (
        <p className="uppercase tracking-widest text-xs text-blue-100 mb-4">
          {eyebrow}
        </p>
      )}
      <h1 className="heading">{title}</h1>
      {subtitle && (
        <p className="text-white-200 mt-6 text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}
