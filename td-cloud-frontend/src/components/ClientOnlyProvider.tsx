"use client";
import React, { useEffect, useState, ReactNode } from "react";

interface ClientOnlyProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnlyProvider({
  children,
  fallback = (
    <div className="flex justify-center items-center min-h-screen">
      Loading...
    </div>
  ),
}: ClientOnlyProviderProps): React.ReactElement | null {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <>{isClient ? children : fallback}</>;
}
