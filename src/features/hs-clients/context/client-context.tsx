"use client";

import * as React from "react";
import type { IHSClientOverview } from "@/features/hs-clients";

const ClientContext = React.createContext<IHSClientOverview | null>(null);

export const ClientContextProvider = ClientContext.Provider;

export function useClientContext() {
  const context = React.useContext(ClientContext);

  if (!context) {
    throw new Error(
      "useClientContext must be used within ClientContextProvider"
    );
  }

  return context;
}
