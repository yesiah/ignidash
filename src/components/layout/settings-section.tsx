"use client";

import { Card } from "@/components/ui/card";
import type { InvalidInputErrorProps } from "@/components/ui/invalid-input-error";
import { SectionHeader } from "./section-header";

interface SettingsSectionProps {
  title?: React.ReactNode;
  desc?: string | React.ReactNode;
  children: React.ReactNode;
  hasBorder?: boolean;
  errorComponent?: React.ReactElement<InvalidInputErrorProps> | false;
}

export function SettingsSection({
  title,
  desc,
  children,
  hasBorder = true,
  errorComponent,
}: SettingsSectionProps) {
  return (
    <div
      className={
        hasBorder ? "border-foreground/10 mb-5 border-b pb-5" : "mb-5 pb-5"
      }
    >
      <SectionHeader title={title} desc={desc} />
      <Card>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {children}
        </form>
      </Card>
      {errorComponent}
    </div>
  );
}
