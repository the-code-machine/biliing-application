"use client";

import DashboardPage from "@/pages-container/dashboard/dashboard.page";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const auth = router.query.auth;
      setIsAuthenticated(!!auth);
    }
  }, [router.isReady, router.query]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-4">
      <DashboardPage />
    </div>
  );
}
