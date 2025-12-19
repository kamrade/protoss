"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/Tabs";

type TabValue = "overview" | "applications";

interface ClientTabsProps {
  clientId: string;
  activeTab: TabValue;
}

export function ClientTabs({ clientId, activeTab }: ClientTabsProps) {
  const router = useRouter();

  const handleTabChange = React.useCallback(
    (value: string) => {
      const nextRoute =
        value === "applications"
          ? `/hs-clients/${encodeURIComponent(clientId)}/applications`
          : `/hs-clients/${encodeURIComponent(clientId)}/overview`;

      router.push(nextRoute);
    },
    [clientId, router]
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="bg-white">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
