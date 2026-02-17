interface PageLoadingProps {
  message: string;
  ariaLabel?: string;
}

export default function PageLoading({ message, ariaLabel }: PageLoadingProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className="text-muted-foreground flex h-full items-center justify-center px-2 text-2xl sm:px-3 sm:text-xl lg:px-4"
    >
      <span className="text-center">
        {message}
        <span className="loading-ellipsis inline-block" aria-hidden="true" />
      </span>
    </div>
  );
}
