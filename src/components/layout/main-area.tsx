interface MainAreaProps {
  children?: React.ReactNode;
}

export default function MainArea({ children }: MainAreaProps) {
  return (
    <main className="lg:pl-72">
      <div className="@container xl:pl-96">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </div>
    </main>
  );
}
