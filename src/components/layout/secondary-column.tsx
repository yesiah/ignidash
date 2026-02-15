export default function SecondaryColumn({ children }: { children?: React.ReactNode }) {
  return (
    <aside
      className="border-border/50 fixed inset-y-0 left-72 hidden w-96 overflow-y-auto border-r px-2 group-data-[state=collapsed]/sidebar:left-16 sm:px-3 lg:px-4 xl:block"
      style={{
        transitionProperty: 'left',
        transitionDuration: 'var(--sidebar-transition-duration)',
        transitionTimingFunction: 'var(--sidebar-transition-easing)',
      }}
    >
      {children}
    </aside>
  );
}
