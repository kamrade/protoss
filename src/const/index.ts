export const entitySections = [
  {
    title: "Shareholders",
    affiliation: "SHAREHOLDER" as const,
    options: [
      { label: "Individual", type: "individual" },
      { label: "Corporate", type: "corporate" },
    ],
  },
  {
    title: "Directors",
    affiliation: "DIRECTOR" as const,
    options: [{ label: "Individual", type: "individual" }],
  },
  {
    title: "Authorised Signatories",
    affiliation: "AUTHORISED_SIGNATORY" as const,
    options: [{ label: "Individual", type: "individual" }],
  },
  {
    title: "Users",
    affiliation: "USER" as const,
    options: [{ label: "Individual", type: "individual" }],
  },
] as const;

export * from './sections';