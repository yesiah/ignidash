interface YourNumbersSectionHeaderProps {
  headline: string;
  desc: string;
}

export function YourNumbersSectionHeader({
  headline,
  desc,
}: YourNumbersSectionHeaderProps) {
  return (
    <div className="ml-2">
      <h4 className="text-base font-semibold">{headline}</h4>
      <p className="text-muted-foreground mt-2 text-sm">{desc}</p>
    </div>
  );
}
