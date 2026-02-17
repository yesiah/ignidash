import clsx from 'clsx';

export function Divider({
  soft = false,
  hard = false,
  className,
  ...props
}: { soft?: boolean; hard?: boolean } & React.ComponentPropsWithoutRef<'hr'>) {
  let defaultBorderColor = 'border-border/50';
  if (soft) defaultBorderColor = 'border-border/25';
  if (hard) defaultBorderColor = 'border-border';

  return <hr role="presentation" {...props} className={clsx(className, 'w-full border-t', defaultBorderColor)} />;
}
