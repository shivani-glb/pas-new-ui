import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ads: [],
  // Modal states
  selectedAdForAI: null,
  aiAnalysis: "",
  isAnalyzing: false,
  showCampaignGen: false,
  campaignStrategy: "",
  isGeneratingStrategy: false,
};

const adSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    setAds: (state, action) => {
      state.ads = action.payload;
    },
    setSelectedAdForAI: (state, action) => {
      state.selectedAdForAI = action.payload;
      if (action.payload === null) {
        state.aiAnalysis = "";
        state.isAnalyzing = false;
      }
    },
    setAiAnalysis: (state, action) => {
      state.aiAnalysis = action.payload;
    },
    setIsAnalyzing: (state, action) => {
      state.isAnalyzing = action.payload;
    },
    setShowCampaignGen: (state, action) => {
      state.showCampaignGen = action.payload;
    },
    setCampaignStrategy: (state, action) => {
      state.campaignStrategy = action.payload;
    },
    setIsGeneratingStrategy: (state, action) => {
      state.isGeneratingStrategy = action.payload;
    },
  },
});

export const {
  setAds,
  setSelectedAdForAI,
  setAiAnalysis,
  setIsAnalyzing,
  setShowCampaignGen,
  setCampaignStrategy,
  setIsGeneratingStrategy,
} = adSlice.actions;

export default adSlice.reducer;
