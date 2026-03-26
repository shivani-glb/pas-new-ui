import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");
  return saved ? saved === "dark" : true;
};

const initialState = {
  isSidebarOpen: true,
  isDarkMode: getInitialTheme(),
  activeTab: ["Newest"],
  activePlatform: "Facebook",
  activeCategory: "all",
  searchQuery: "",
  searchIn: "Ad Text",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      // Note: we'll handle localStorage in a middleware or effect,
      // but RTK slice shouldn't ideally have side effects.
      // For simplicity, we can do it in the component or a listener,
      // or just trust the Redux state and sync in App.jsx.
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setActivePlatform: (state, action) => {
      state.activePlatform = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchIn: (state, action) => {
      state.searchIn = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setActiveTab,
  setActivePlatform,
  setActiveCategory,
  setSearchQuery,
  setSearchIn,
} = uiSlice.actions;

export default uiSlice.reducer;
