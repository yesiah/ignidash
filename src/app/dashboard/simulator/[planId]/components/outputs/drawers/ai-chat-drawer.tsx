interface AIChatDrawerProps {
  setOpen: (open: boolean) => void;
}

export default function AIChatDrawer({ setOpen }: AIChatDrawerProps) {
  return (
    <div className="-mx-2 hidden sm:-mx-3 md:fixed md:inset-y-[4.8125rem] md:flex md:w-64 md:flex-col">
      <div className="border-border/50 flex grow flex-col border-r bg-zinc-50 dark:bg-black/10">Sidebar</div>
    </div>
  );
}
