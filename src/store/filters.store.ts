import { create } from "zustand";

type FiltersStore = {
  category: string | null;

  setCategory: (category: string | null) => void;

  clearFilters: () => void;
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  category: null,

  setCategory: (category) =>
    set({
      category,
    }),

  clearFilters: () =>
    set({
      category: null,
    }),
}));