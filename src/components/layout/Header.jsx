import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Play,
  Search,
  ChevronDown,
  Sparkles,
  Bell,
  Loader2,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

// Sub-component for Suggestions Dropdown to keep JSX clean
const SuggestionDropdown = ({
  suggestions,
  catSuggestions,
  onSelect,
  lastWord,
}) => (
  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#222] rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
    {/* Word Suggestions */}
    <div className="space-y-0.5">
      {suggestions.map((s, idx) => {
        let displayWord = typeof s === "string" ? s : s?.word;
        if (!displayWord) return null;
        return (
          <button
            key={`word-${idx}`}
            onClick={() => onSelect(s)}
            className="w-full text-left px-4 py-1.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors flex items-center gap-3 group"
          >
            <Search
              size={12}
              className="text-gray-400 group-hover:text-indigo-500"
            />
            <span>{displayWord}</span>
          </button>
        );
      })}
    </div>

    {/* Separator & Categories Label */}
    {suggestions.length > 0 && catSuggestions.length > 0 && (
      <div className="my-1.5 flex items-center px-4 gap-3">
        <div className="h-[1px] flex-1 bg-gray-200 dark:bg-[#333]" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Categories
        </span>
        <div className="h-[1px] flex-1 bg-gray-200 dark:bg-[#333]" />
      </div>
    )}

    {/* Category Suggestions */}
    <div className="space-y-0.5">
      {catSuggestions.map((c, idx) => (
        <button
          key={`cat-${idx}`}
          onClick={() => onSelect(c, "category")}
          className="w-full text-left px-4 py-2 text-[12px] hover:bg-indigo-50 dark:hover:bg-indigo-600/10 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded bg-gray-100 dark:bg-[#222] group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 text-gray-500 dark:text-[#666] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <Sparkles size={11} />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-[#666] text-[10px]">
                  {c.major}{" "}
                  <ChevronDown
                    size={8}
                    className="-rotate-90 inline opacity-50"
                  />{" "}
                  {c.sub}
                </span>
                <span className="text-gray-900 dark:text-[#aaa] font-medium group-hover:text-indigo-600 dark:group-hover:text-white">
                  Matched with "{lastWord}"
                </span>
              </div>
            </div>
            <Play
              size={10}
              className="text-gray-300 dark:text-[#444] group-hover:text-indigo-500"
              fill="currentColor"
            />
          </div>
        </button>
      ))}
    </div>
  </div>
);

const Header = ({
  isSidebarOpen,
  setIsSidebarOpen,
  searchIn,
  setSearchIn,
  searchQuery,
  setSearchQuery,
  onGenerateStrategy,
  filters,
  isDarkMode,
  toggleTheme,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [catSuggestions, setCatSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Get the last word for individual word suggestion
  const lastWord = (searchQuery || "").trim().split(/\s+/).pop() || "";
  const debouncedLastWord = useDebounce(lastWord, 300);

  // Also debounce the full query for categories
  const debouncedFullQuery = useDebounce(searchQuery || "", 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedLastWord.length < 3) {
        setSuggestions([]);
        setCatSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // 1. Fetch Word Suggestions
        const wordRes = await fetch(
          `http://localhost:8001/suggest?query=${encodeURIComponent(debouncedLastWord)}&limit=10`,
        );
        if (wordRes.ok) {
          const data = await wordRes.json();
          if (data && Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
          } else {
            setSuggestions([]);
          }
        }

        // 2. Fetch Category Suggestions
        const catRes = await fetch(
          "https://ai-cat-search.poweradspy.ai/search",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: searchQuery || "", top_k: 5 }),
          },
        );

        if (catRes.ok) {
          const data = await catRes.json();
          if (data && Array.isArray(data.matches)) {
            const uniqueCats = [];
            const seen = new Set();
            data.matches.forEach((m) => {
              if (!m) return;
              const major = m.major_category || "Category";
              const sub = m.sub_category || "Subcategory";
              const key = `${major} > ${sub}`;

              if (!seen.has(key)) {
                uniqueCats.push({
                  major,
                  sub,
                  display: key,
                  word: sub, // fallback word
                });
                seen.add(key);
              }
            });
            setCatSuggestions(uniqueCats);
          } else {
            setCatSuggestions([]);
          }
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err);
        setSuggestions([]);
        setCatSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedLastWord.length >= 3) {
      fetchSuggestions();
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setCatSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedLastWord]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionRef.current &&
        e.target instanceof Node &&
        !suggestionRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion, type = "word") => {
    if (!suggestion) return;

    if (type === "category") {
      // Apply category filter to the sidebar
      if (filters && typeof filters.setSelCategories === "function") {
        const catDisplay = suggestion.display;
        if (catDisplay) {
          filters.setSelCategories((prev) =>
            prev.includes(catDisplay) ? prev : [...prev, catDisplay],
          );
        }
      }

      // Fill only the keyword in search bar
      const keyword = (searchQuery || "").trim() || "";
      setSearchQuery(keyword + " ");
    } else {
      // Display word logic: prioritize .word, then string fallback
      const wordStr =
        typeof suggestion === "string"
          ? suggestion
          : suggestion.word
            ? String(suggestion.word)
            : null;

      if (wordStr) {
        const currentQuery = searchQuery || "";
        const words = currentQuery.trim().split(/\s+/);

        if (words.length > 0) {
          words.pop(); // Remove the partial word
        }

        const prefix = words.length > 0 ? words.join(" ") + " " : "";
        const newQuery = prefix + wordStr + " ";
        setSearchQuery(newQuery);
      }
    }

    setShowSuggestions(false);
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    // Search is already reactive via searchQuery in App.jsx
    // But we could add a manual trigger if needed or just provide visual feedback
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="h-16 px-1.5 sm:px-4 flex items-center justify-between sticky top-0 z-50 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#1c1c1c]">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 dark:text-[#aaa] hover:text-gray-900 dark:hover:text-white"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-1.5 cursor-pointer group">
          <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center group-hover:bg-red-500 transition-colors">
            <Play size={12} fill="white" />
          </div>
          <span className="text-base font-black text-red-500 tracking-tight dark:text-white group-hover:text-red-500 transition-colors">
            POWERADSPY
          </span>
        </div>
      </div>

      {/* Desktop/Tablet Search Bar */}
      <div
        className="hidden sm:flex flex-1 max-w-2xl items-center gap-2 px-6 relative"
        ref={suggestionRef}
      >
        <div className="flex-1 flex items-center bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-lg focus-within:border-indigo-500/50 transition-all">
          <div className="relative group/si">
            <button className="flex items-center gap-1 pl-3 pr-2 py-1.5 text-[10px] font-bold text-gray-500 dark:text-[#888] border-r border-gray-200 dark:border-[#222] whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {searchIn} <ChevronDown size={10} />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#2a2a2a] rounded-xl shadow-2xl w-36 z-50 py-1 opacity-0 pointer-events-none group-hover/si:opacity-100 group-hover/si:pointer-events-auto transition-opacity">
              {["Ad Text", "Advertiser", "Keyword", "Domain"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSearchIn(opt)}
                  className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors ${searchIn === opt ? "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10" : "text-gray-500 dark:text-[#666] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              (suggestions.length > 0 || catSuggestions.length > 0) &&
              setShowSuggestions(true)
            }
            placeholder="Search keyword, advertiser, or domain..."
            className="w-full bg-transparent px-3 py-1.5 outline-none text-sm placeholder:text-gray-400 dark:placeholder:text-[#888] text-gray-900 dark:text-gray-200"
          />
          <div className="flex items-center pr-2">
            {isLoading && (
              <Loader2
                size={14}
                className="animate-spin text-indigo-500 mr-2"
              />
            )}
            <button
              onClick={handleSearch}
              className="text-gray-400 dark:text-[#888] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Search size={15} />
            </button>
          </div>
        </div>

        {/* Suggestion Dropdown (Desktop) */}
        {showSuggestions &&
          (suggestions.length > 0 || catSuggestions.length > 0) && (
            <SuggestionDropdown
              suggestions={suggestions}
              catSuggestions={catSuggestions}
              onSelect={handleSelectSuggestion}
              lastWord={lastWord}
            />
          )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onGenerateStrategy}
          className="hidden lg:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-white"
        >
          <Sparkles size={12} /> Strategy
        </button>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="flex sm:hidden p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg text-gray-500 dark:text-[#aaa] hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Search size={17} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg text-gray-500 dark:text-[#aaa] hover:text-gray-900 dark:hover:text-white transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button className="p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg relative text-gray-500 dark:text-[#aaa] hover:text-gray-900 dark:hover:text-white transition-colors">
          <Bell size={17} />
          <span className="absolute top-1 sm:top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black cursor-pointer hover:bg-indigo-500 transition-colors text-white">
          AI
        </div>
      </div>

      {/* Floating Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 z-[100] bg-white dark:bg-[#0a0a0a] flex items-center px-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex-1 flex flex-col relative">
            <div className="flex items-center bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-lg px-2">
              <div className="relative group/si">
                <button className="flex items-center gap-1 pl-1 pr-2 py-1.5 text-[10px] font-bold text-gray-500 dark:text-[#888] border-r border-gray-200 dark:border-[#222] whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {searchIn} <ChevronDown size={10} />
                </button>
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#2a2a2a] rounded-xl shadow-2xl w-32 z-50 py-1 opacity-0 pointer-events-none group-hover/si:opacity-100 group-hover/si:pointer-events-auto transition-opacity">
                  {["Ad Text", "Advertiser", "Keyword", "Domain"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSearchIn(opt)}
                      className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors ${searchIn === opt ? "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10" : "text-gray-500 dark:text-[#666] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                autoFocus
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                  if (e.key === "Escape") setIsMobileSearchOpen(false);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search..."
                className="flex-1 w-full bg-transparent px-3 py-1.5 outline-none text-sm text-gray-900 dark:text-gray-200"
              />
              <button
                onClick={() => {
                  handleSearch();
                  setIsMobileSearchOpen(false);
                }}
                className="p-1 text-gray-400 dark:text-[#888] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Search size={15} />
              </button>
            </div>

            {/* Suggestion Dropdown (Mobile) */}
            {showSuggestions &&
              (suggestions.length > 0 || catSuggestions.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 z-[110]">
                  <SuggestionDropdown
                    suggestions={suggestions}
                    catSuggestions={catSuggestions}
                    onSelect={handleSelectSuggestion}
                    lastWord={lastWord}
                  />
                </div>
              )}
          </div>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="ml-2 p-2 text-gray-500 dark:text-[#aaa] hover:text-gray-900 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
