import { XCircleIcon } from "@heroicons/react/20/solid";

export interface InvalidInputErrorProps {
  title: string;
  description?: string;
}

export default function InvalidInputError({
  title,
  description,
}: InvalidInputErrorProps) {
  return (
    <div className="rounded-lg bg-red-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          {description && (
            <div className="mt-2 text-sm text-red-700">
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
