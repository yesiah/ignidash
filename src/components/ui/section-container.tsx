interface SectionContainerProps {
  showBottomBorder: boolean;
  children: React.ReactNode;
}

export default function SectionContainer({ children, showBottomBorder }: SectionContainerProps) {
  const borderClass = showBottomBorder ? 'border-border border-b' : '';
  return <div className={`mb-5 pb-5 ${borderClass}`}>{children}</div>;
}
