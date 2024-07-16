import Link from "next/link";
import { type ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface props {
  children: ReactNode;
}
export default function DashboardLayout({ children }: props) {
  return (
    <div>
      <div className="relative bg-muted/40">
        <div className="flex w-full gap-x-2 px-3 pb-20 lg:pb-0">
          <div className="w-full md:h-[calc(100dvh-70px)] md:overflow-hidden">
            <div className="py-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LayoutContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ScrollArea
      className={cn(
        "border-primary-border h-[calc(100dvh-90px)] rounded-md border bg-white",
        className,
      )}
    >
      {children}
    </ScrollArea>
  );
}
