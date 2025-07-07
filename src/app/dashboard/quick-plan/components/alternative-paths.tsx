"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/catalyst/input";

export function AlternativePaths() {
  return (
    <Disclosure>
      <DisclosureButton className="group data-open:border-foreground/10 flex w-full items-center justify-between gap-2 data-open:mb-5 data-open:border-b data-open:pb-5">
        Coast FIRE
        <ChevronDownIcon className="w-5 group-data-open:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel>
        <form onSubmit={(e) => e.preventDefault()} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="target-retirement-age"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Target Retirement Age
            </label>
            <Input id="target-retirement-age" type="number" placeholder="65" />
          </div>
        </form>
      </DisclosurePanel>
    </Disclosure>
  );
}
