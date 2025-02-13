// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <HeroUIProvider>{children}</HeroUIProvider>
    </div>
  );
}
