import React, { useState, useEffect } from "react";

// Hooks & Services
import { useFilters } from "./hooks/useFilters";
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
  // ── Application State ──────────────────────────────────────────────────
  const filters = useFilters();
  const [ads, setAds] = useState([]);

  // UI State
  const [activeTab, setActiveTab] = useState("Newest");
  const [activePlatform, setActivePlatform] = useState("Facebook");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIn, setSearchIn] = useState("Ad Text");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal State
  const [selectedAdForAI, setSelectedAdForAI] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [showCampaignGen, setShowCampaignGen] = useState(false);
  const [campaignStrategy, setCampaignStrategy] = useState("");
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);

  // ── Data Fetching ──────────────────────────────────────────────────────
  useEffect(() => {
    const loadAds = async () => {
      try {
        // Pass all relevant filters/search to the generic fetch provider
        const data = await fetchAds({
          ...filters,
          activePlatform,
          activeCategory,
          searchQuery,
          searchIn,
        });
        setAds(data);
      } catch (error) {
        console.error("Failed to load ads:", error);
      }
    };

    loadAds();
  }, [
    // Re-fetch when major filters change
    activePlatform,
    activeCategory,
    searchQuery,
    searchIn,
    filters.selCategories,
    filters.selCountries,
    filters.sortBy,
    // ... add other filter dependencies as needed when real API is added
  ]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleAnalyzeAd = async (ad) => {
    setSelectedAdForAI(ad);
    setIsAnalyzing(true);
    setAiAnalysis("");
    try {
      const prompt = buildAuditPrompt(ad);
      const result = await fetchGemini(prompt);
      setAiAnalysis(result);
    } catch {
      setAiAnalysis("Analysis unavailable.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCampaign = async () => {
    setIsGeneratingStrategy(true);
    setShowCampaignGen(true);
    setCampaignStrategy("");
    try {
      const prompt = buildCampaignPrompt(ads);
      const result = await fetchGemini(prompt);
      setCampaignStrategy(result);
    } catch {
      setCampaignStrategy("Strategy generation failed.");
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-indigo-500/20 overflow-hidden">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        searchIn={searchIn}
        setSearchIn={setSearchIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onGenerateStrategy={handleGenerateCampaign}
        filters={filters}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          filters={filters}
          onGenerateStrategy={handleGenerateCampaign}
        />

        <AdGrid
          ads={ads}
          activePlatform={activePlatform}
          setActivePlatform={setActivePlatform}
          filters={filters}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCategory={activeCategory}
          onAnalyzeAd={handleAnalyzeAd}
        />
      </div>

      <AIAnalysisModal
        ad={selectedAdForAI}
        analysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
        onClose={() => setSelectedAdForAI(null)}
      />

      <CampaignModal
        isOpen={showCampaignGen}
        strategy={campaignStrategy}
        isGenerating={isGeneratingStrategy}
        onClose={() => setShowCampaignGen(false)}
      />
    </div>
  );
};

export default App;
