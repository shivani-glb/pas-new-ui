import React, { useState, useEffect, useRef } from 'react';
import { Menu, Play, Search, ChevronDown, Sparkles, Bell, Loader2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const Header = ({
    isSidebarOpen,
    setIsSidebarOpen,
    searchIn,
    setSearchIn,
    searchQuery,
    setSearchQuery,
    onGenerateStrategy,
    filters
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [catSuggestions, setCatSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);

    // Get the last word for individual word suggestion
    const lastWord = searchQuery.trim().split(/\s+/).pop() || '';
    const debouncedLastWord = useDebounce(lastWord, 300);

    // Also debounce the full query for categories
    const debouncedFullQuery = useDebounce(searchQuery, 300);

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
                const wordRes = await fetch(`http://localhost:8001/suggest?query=${encodeURIComponent(debouncedLastWord)}&limit=10`);
                if (wordRes.ok) {
                    const data = await wordRes.json();
                    if (data && Array.isArray(data.suggestions)) {
                        setSuggestions(data.suggestions);
                    } else {
                        setSuggestions([]);
                    }
                }

                // 2. Fetch Category Suggestions
                const catRes = await fetch('https://ai-cat-search.poweradspy.ai/search', {
                    method: 'POST',
                    headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: searchQuery || '', top_k: 5 })
                });

                if (catRes.ok) {
                    const data = await catRes.json();
                    if (data && Array.isArray(data.matches)) {
                        const uniqueCats = [];
                        const seen = new Set();
                        data.matches.forEach(m => {
                            if (!m) return;
                            const major = m.major_category || 'Category';
                            const sub = m.sub_category || 'Subcategory';
                            const key = `${major} > ${sub}`;
                            
                            if (!seen.has(key)) {
                                uniqueCats.push({
                                    major,
                                    sub,
                                    display: key,
                                    word: sub // fallback word
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
            if (suggestionRef.current && e.target instanceof Node && !suggestionRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectSuggestion = (suggestion, type = 'word') => {
        if (!suggestion) return;
        
        if (type === 'category') {
            // Apply category filter to the sidebar
            if (filters && typeof filters.setSelCategories === 'function') {
                const catDisplay = suggestion.display;
                if (catDisplay) {
                    filters.setSelCategories(prev => 
                        prev.includes(catDisplay) ? prev : [...prev, catDisplay]
                    );
                }
            }

            // Fill only the keyword in search bar
            const keyword = searchQuery.trim() || '';
            setSearchQuery(keyword + ' ');
        } else {
            // Display word logic: prioritize .word, then string fallback
            const wordStr = typeof suggestion === 'string' ? suggestion : (suggestion.word ? String(suggestion.word) : null);
            
            if (wordStr) {
                const currentQuery = searchQuery || '';
                const words = currentQuery.trim().split(/\s+/);
                
                if (words.length > 0) {
                    words.pop(); // Remove the partial word
                }
                
                const prefix = words.length > 0 ? words.join(' ') + ' ' : '';
                const newQuery = prefix + wordStr + ' ';
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
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="h-12 px-4 flex items-center justify-between sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1c1c1c]">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors text-[#555] hover:text-white"
                >
                    <Menu size={18} />
                </button>
                <div className="flex items-center gap-1.5 cursor-pointer group">
                    <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center group-hover:bg-red-500 transition-colors">
                        <Play size={12} fill="white" />
                    </div>
                    <span className="text-base font-black tracking-tight text-white group-hover:text-red-500 transition-colors">POWERADSPY</span>
                </div>
            </div>

            {/* Search Container */}
            <div className="flex-1 max-w-2xl flex items-center gap-2 px-6 relative" ref={suggestionRef}>
                <div className="flex-1 flex items-center bg-[#111] border border-[#222] rounded-xl overflow-hidden focus-within:border-indigo-500/50 transition-all">
                    <div className="relative group/si">
                        <button className="flex items-center gap-1 pl-3 pr-2 py-1.5 text-[10px] font-bold text-[#555] border-r border-[#222] whitespace-nowrap hover:text-indigo-400 transition-colors">
                            {searchIn} <ChevronDown size={10} />
                        </button>
                        <div className="absolute top-full left-0 mt-1 bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-2xl w-36 z-50 py-1 opacity-0 pointer-events-none group-hover/si:opacity-100 group-hover/si:pointer-events-auto transition-opacity">
                            {['Ad Text', 'Advertiser', 'Keyword', 'Domain'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSearchIn(opt)}
                                    className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors ${searchIn === opt ? 'text-indigo-400 bg-indigo-500/10' : 'text-[#666] hover:text-white hover:bg-white/[0.04]'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <input
                        type="text"
                        value={searchQuery || ''}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => (suggestions.length > 0 || catSuggestions.length > 0) && setShowSuggestions(true)}
                        placeholder="Search keyword, advertiser, or domain..."
                        className="w-full bg-transparent px-3 py-1.5 outline-none text-sm placeholder:text-[#888] text-gray-200"
                    />
                    <div className="flex items-center pr-2">
                        {isLoading && <Loader2 size={14} className="animate-spin text-indigo-500 mr-2" />}
                        <button 
                            onClick={handleSearch}
                            className="text-[#888] hover:text-indigo-400 transition-colors"
                        >
                            <Search size={15} />
                        </button>
                    </div>
                </div>

                {/* Suggestions Popup */}
                {showSuggestions && (suggestions.length > 0 || catSuggestions.length > 0) && (
                    <div className="absolute top-full left-6 right-6 mt-1 bg-[#161616] border border-[#222] rounded-xl shadow-2xl z-[100] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Word Suggestions */}
                        <div className="space-y-0.5">
                            {suggestions.map((s, idx) => {
                                // Strictly ignore candidates that are objects (e.g., phonetic candidates)
                                // User provided example: "word": { "candidate": "cos" }
                                let displayWord = null;
                                if (typeof s === 'string') {
                                    displayWord = s;
                                } else if (s && typeof s.word === 'string') {
                                    displayWord = s.word;
                                }

                                if (!displayWord) return null;

                                return (
                                    <button
                                        key={`word-${idx}`}
                                        onClick={() => handleSelectSuggestion(s)}
                                        className="w-full text-left px-4 py-1.5 text-[13px] text-gray-300 hover:bg-white/[0.04] transition-colors flex items-center gap-3 group"
                                    >
                                        <Search size={12} className="text-[#444] group-hover:text-indigo-400" />
                                        <span>{displayWord}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Separator */}
                        {suggestions.length > 0 && catSuggestions.length > 0 && (
                            <div className="my-1.5 flex items-center px-4 gap-3">
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#333] to-transparent" />
                                <span className="text-[9px] font-black text-[#444] uppercase tracking-widest">Categories</span>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#333] to-transparent" />
                            </div>
                        )}

                        {/* Category Suggestions */}
                        <div className="space-y-0.5">
                            {catSuggestions.map((c, idx) => (
                                <button
                                    key={`cat-${idx}`}
                                    onClick={() => handleSelectSuggestion(c, 'category')}
                                    className="w-full text-left px-4 py-2 text-[12px] hover:bg-indigo-600/10 transition-colors group relative"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1 rounded bg-[#222] group-hover:bg-indigo-500/20 text-[#666] group-hover:text-indigo-400 transition-colors">
                                                <Sparkles size={11} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#666] text-[10px] group-hover:text-indigo-300/70 transition-colors flex items-center gap-1">
                                                    {c.major} <ChevronDown size={8} className="-rotate-90 opacity-50" /> {c.sub}
                                                </span>
                                                <span className="text-[#aaa] font-medium group-hover:text-white transition-colors">
                                                    Matched with "{searchQuery.trim().split(/\s+/).pop()}"
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-[#444] group-hover:text-indigo-500/50 transition-colors">
                                            <Play size={10} fill="currentColor" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onGenerateStrategy}
                    className="hidden lg:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-white"
                >
                    <Sparkles size={12} /> Strategy
                </button>
                <button className="p-1.5 hover:bg-white/[0.06] rounded-lg relative text-[#aaa] hover:text-white transition-colors">
                    <Bell size={17} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black cursor-pointer hover:bg-indigo-500 transition-colors text-white">AI</div>
            </div>
        </header>
    );
};

export default Header;
