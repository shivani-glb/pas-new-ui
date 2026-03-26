import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import filterReducer from "./slices/filterSlice";
import adReducer from "./slices/adSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    filters: filterReducer,
    ads: adReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore setting selectedAdForAI or dates if they have non-serializable properties temporarily.
        // Dates should ideally be timestamp strings in Redux, but for a smooth migration
        // we might ignore it for now or rely on the fact that we use null or Date objects.
        ignoredActions: [
          "filters/setDateAdSeen",
          "filters/setDatePostSeen",
          "filters/setDateDomainReg",
        ],
        ignoredPaths: [
          "filters.dateAdSeen",
          "filters.datePostSeen",
          "filters.dateDomainReg",
          "ads.selectedAdForAI",
        ],
      },
    }),
});
