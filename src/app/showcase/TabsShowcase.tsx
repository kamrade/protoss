import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";

const tabs = [
  { value: "overview", label: "Overview", description: "Key signals" },
  { value: "activity", label: "Activity", description: "Live stream" },
  { value: "settings", label: "Settings", description: "Workspace config" },
] as const;

export function TabsShowcase() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Component
        </p>
        <h2 className="text-3xl font-semibold text-gray-900">Tabs</h2>
        <p className="mt-2 text-sm text-gray-600">
          Radix tabs with pills-style triggers and elevated content panels.
        </p>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="overview">
          <TabsList className="flex">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <h3 className="text-lg font-semibold text-gray-900">
                {tab.label}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {tab.description} for this workspace view.
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
