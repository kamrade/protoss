export interface ICategory {
  id: number;
  name: string;
  shortName: string;
}

export const applicationCategories: Record<string, ICategory> = {
  CA: {
    id: 3,
    name: 'Canada',
    shortName: 'CA',
  },
  DS: {
    id: 4,
    name: 'Digital Services',
    shortName: 'DS',
  },
  MT: {
    id: 5,
    name: 'Malta',
    shortName: 'MT',
  },
  UK: {
    id: 6,
    name: 'United Kingdom',
    shortName: 'UK',
  },
};

export const getCategoryShortNameById = (id: number) => {
  const category = Object.values(applicationCategories).find((cat) => cat.id === id);
  return category ? category.shortName : null;
};