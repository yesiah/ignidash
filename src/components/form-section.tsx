"use client";

import { Card } from "@/components/card";

interface FormSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  hasBorder?: boolean;
}

export function FormSection({
  title,
  children,
  hasBorder = true,
}: FormSectionProps) {
  return (
    <div
      className={
        hasBorder ? "border-foreground/10 mb-5 border-b pb-5" : "mb-5 pb-5"
      }
    >
      <div className="ml-2">
        <h4 className="text-base font-semibold">{title}</h4>
      </div>
      <Card>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {children}
        </form>
      </Card>
    </div>
  );
}
