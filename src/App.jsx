import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Actions
import {
  setAds,
  setSelectedAdForAI,
  setAiAnalysis,
  setIsAnalyzing,
  setShowCampaignGen,
  setCampaignStrategy,
  setIsGeneratingStrategy,
} from "./store/slices/adSlice";

// Services
import {
  fetchAds,
  buildAuditPrompt,
  buildCampaignPrompt,
  fetchGemini,
} from "./services/api";

// Components
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import AdGrid from "./components/ads/AdGrid";
import AIAnalysisModal from "./components/modals/AIAnalysisModal";
import CampaignModal from "./components/modals/CampaignModal";

const App = () => {
  const dispatch = useDispatch();

  // ── Application State (from Redux) ──────────────────────────────────────
  const filters = useSelector((state) => state.filters);
  const {
    ads,
    selectedAdForAI,
    aiAnalysis,
    isAnalyzing,
    showCampaignGen,
    campaignStrategy,
    isGeneratingStrategy,
  } = useSelector((state) => state.ads);
  const { activePlatform, activeCategory, searchQuery, searchIn, isDarkMode } =
    useSelector((state) => state.ui);

  // Theme Persistence
  useEffect(() => {
    console.log("Applying theme class:", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ── Data Fetching ──────────────────────────────────────────────────────
  useEffect(() => {
    const loadAds = async () => {
      try {
        const data = await fetchAds({
          ...filters,
          activePlatform,
          activeCategory,
          searchQuery,
          searchIn,
        });
        dispatch(setAds(data));
      } catch (error) {
        console.error("Failed to load ads:", error);
      }
    };

    loadAds();
  }, [
    dispatch,
    activePlatform,
    activeCategory,
    searchQuery,
    searchIn,
    filters.selCategories,
    filters.selCountries,
    filters.sortBy,
  ]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleAnalyzeAd = async (ad) => {
    dispatch(setSelectedAdForAI(ad));
    dispatch(setIsAnalyzing(true));
    dispatch(setAiAnalysis(""));
    try {
      const prompt = buildAuditPrompt(ad);
      const result = await fetchGemini(prompt);
      dispatch(setAiAnalysis(result));
    } catch {
      dispatch(setAiAnalysis("Analysis unavailable."));
    } finally {
      dispatch(setIsAnalyzing(false));
    }
  };

  const handleGenerateCampaign = async () => {
    dispatch(setIsGeneratingStrategy(true));
    dispatch(setShowCampaignGen(true));
    dispatch(setCampaignStrategy(""));
    try {
      const prompt = buildCampaignPrompt(ads);
      const result = await fetchGemini(prompt);
      dispatch(setCampaignStrategy(result));
    } catch {
      dispatch(setCampaignStrategy("Strategy generation failed."));
    } finally {
      dispatch(setIsGeneratingStrategy(false));
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white flex flex-col font-sans selection:bg-indigo-500/20 overflow-hidden">
      <Header onGenerateStrategy={handleGenerateCampaign} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onGenerateStrategy={handleGenerateCampaign} />
        <AdGrid onAnalyzeAd={handleAnalyzeAd} />
      </div>

      <AIAnalysisModal
        ad={selectedAdForAI}
        analysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
        onClose={() => dispatch(setSelectedAdForAI(null))}
      />

      <CampaignModal
        isOpen={showCampaignGen}
        strategy={campaignStrategy}
        isGenerating={isGeneratingStrategy}
        onClose={() => dispatch(setShowCampaignGen(false))}
      />
    </div>
  );
};

export default App;
