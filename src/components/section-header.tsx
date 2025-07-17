interface SectionHeaderProps {
  title: string | React.ReactNode;
  desc: string | React.ReactNode;
}

export function SectionHeader({ title, desc }: SectionHeaderProps) {
  return (
    <div className="ml-2">
      <h4 className="text-base font-semibold">{title}</h4>
      <p className="text-muted-foreground mt-2 text-sm">{desc}</p>
    </div>
  );
}
