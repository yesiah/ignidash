"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";

interface DisclosureSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DisclosureSection({
  title,
  children,
  className,
}: DisclosureSectionProps) {
  return (
    <Disclosure>
      <DisclosureButton
        className={cn(
          "group data-open:border-foreground/10 flex w-full items-center justify-between gap-2 data-open:mb-5 data-open:border-b data-open:pb-5",
          className ?? ""
        )}
      >
        {title}
        <ChevronDownIcon className="w-5 group-data-open:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel>{children}</DisclosurePanel>
    </Disclosure>
  );
}
