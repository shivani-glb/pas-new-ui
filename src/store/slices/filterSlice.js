import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Multi-select filters
  selCategories: [],
  selAdTypes: [],
  selCTAs: [],
  selCountries: [],
  selEcommerce: [],
  selFunnels: [],
  selAffiliates: [],

  // Engagement range filters
  likesRange: [0, 100000],
  sharesRange: [0, 100000],
  commentsRange: [0, 100000],
  impressionsRange: [0, 1000000],

  // Single-select filters
  adSeen: "Anytime",
  postDate: "Last 30 Days",
  domainAge: "All Ages",
  sortBy: ["Newest"],

  // Date range filters
  dateAdSeen: { start: null, end: null },
  datePostSeen: { start: null, end: null },
  dateDomainReg: { start: null, end: null },
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    // Multi-select
    setSelCategories: (state, action) => {
      state.selCategories = action.payload;
    },
    setSelAdTypes: (state, action) => {
      state.selAdTypes = action.payload;
    },
    setSelCTAs: (state, action) => {
      state.selCTAs = action.payload;
    },
    setSelCountries: (state, action) => {
      state.selCountries = action.payload;
    },
    setSelEcommerce: (state, action) => {
      state.selEcommerce = action.payload;
    },
    setSelFunnels: (state, action) => {
      state.selFunnels = action.payload;
    },
    setSelAffiliates: (state, action) => {
      state.selAffiliates = action.payload;
    },

    // Engagement ranges
    setLikesRange: (state, action) => {
      state.likesRange = action.payload;
    },
    setSharesRange: (state, action) => {
      state.sharesRange = action.payload;
    },
    setCommentsRange: (state, action) => {
      state.commentsRange = action.payload;
    },
    setImpressionsRange: (state, action) => {
      state.impressionsRange = action.payload;
    },

    // Single-select
    setAdSeen: (state, action) => {
      state.adSeen = action.payload;
    },
    setPostDate: (state, action) => {
      state.postDate = action.payload;
    },
    setDomainAge: (state, action) => {
      state.domainAge = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    // Date ranges
    setDateAdSeen: (state, action) => {
      state.dateAdSeen = action.payload;
    },
    setDatePostSeen: (state, action) => {
      state.datePostSeen = action.payload;
    },
    setDateDomainReg: (state, action) => {
      state.dateDomainReg = action.payload;
    },

    clearAllFilters: () => {
      return initialState;
    },
  },
});

export const {
  setSelCategories,
  setSelAdTypes,
  setSelCTAs,
  setSelCountries,
  setSelEcommerce,
  setSelFunnels,
  setSelAffiliates,
  setLikesRange,
  setSharesRange,
  setCommentsRange,
  setImpressionsRange,
  setAdSeen,
  setPostDate,
  setDomainAge,
  setSortBy,
  setDateAdSeen,
  setDatePostSeen,
  setDateDomainReg,
  clearAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;

// Selectors for derived state
export const selectActiveDateFiltersCount = (state) => {
  const { dateAdSeen, datePostSeen, dateDomainReg } = state.filters;
  let count = 0;
  if (dateAdSeen?.start || dateAdSeen?.end) count++;
  if (datePostSeen?.start || datePostSeen?.end) count++;
  if (dateDomainReg?.start || dateDomainReg?.end) count++;
  return count;
};

export const selectTotalActiveFiltersCount = (state) => {
  const f = state.filters;
  const activeDateFilters = selectActiveDateFiltersCount(state);
  return (
    f.selCategories.length +
    f.selAdTypes.length +
    f.selCTAs.length +
    f.selCountries.length +
    f.selEcommerce.length +
    f.selFunnels.length +
    f.selAffiliates.length +
    activeDateFilters
  );
};
