"use client";

import * as React from "react";

type ApiKeyContextValue = {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
};

const ApiKeyContext = React.createContext<ApiKeyContextValue | undefined>(
  undefined
);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = React.useState<string | null>(null);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export const useApiKey = () => {
  const context = React.useContext(ApiKeyContext);

  if (!context) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }

  return context;
};
