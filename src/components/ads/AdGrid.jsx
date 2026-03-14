import React from "react";
import { LayoutGrid, ChevronRight } from "lucide-react";
import AdCard from "./AdCard";
import PlatformTab from "../shared/PlatformTab";
import FilterChip from "../filters/FilterChip";
import SortDropdown from "../filters/SortDropdown";
import DateFilterDropdown from "../filters/DateFilterDropdown";
import { PLATFORMS, SORT_TABS, AD_CATEGORIES } from "../../constants";

const AdGrid = ({
  ads,
  activePlatform,
  setActivePlatform,
  filters,
  activeTab,
  setActiveTab,
  activeCategory,
  onAnalyzeAd,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isManualExpanded, setIsManualExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Threshold set to 1024px to include tablets
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isExpanded = (!isMobile && isHovered) || (isMobile && isManualExpanded);

  // Determine which platforms to show in collapsed state
  const activeIndex = PLATFORMS.findIndex((p) => p.id === activePlatform);
  let visibleIndices = [];
  if (isExpanded) {
    visibleIndices = PLATFORMS.map((_, i) => i);
  } else {
    // Show 3 icons: neighbors of active
    let start = activeIndex - 1;
    if (start < 0) start = 0;
    if (activeIndex + 1 >= PLATFORMS.length) start = PLATFORMS.length - 3;
    visibleIndices = [start, start + 1, start + 2];
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-[#0a0a0a] p-5">
      {/* Toolbar row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Platform tabs */}
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-0.5 p-1 bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-[#1c1c1c] transition-all duration-300 ease-in-out group/plat ${
                isExpanded
                  ? isMobile
                    ? "overflow-x-auto max-w-[calc(100vw-120px)]"
                    : "overflow-hidden max-w-[1000px]"
                  : "overflow-hidden max-w-[220px]"
              }`}
              onMouseEnter={() => !isMobile && setIsHovered(true)}
              onMouseLeave={() => !isMobile && setIsHovered(false)}
            >
              {PLATFORMS.map((p, idx) => {
                const isVisible = visibleIndices.includes(idx);
                return (
                  <div
                    key={p.id}
                    className={`transition-all duration-300 ease-in-out ${
                      isVisible
                        ? "opacity-100 translate-x-0 w-auto"
                        : "opacity-0 -translate-x-2 w-0 overflow-hidden pointer-events-none"
                    }`}
                  >
                    <PlatformTab
                      Icon={p.Icon}
                      label={p.label}
                      active={activePlatform === p.id}
                      onClick={() => setActivePlatform(p.id)}
                      color={p.color}
                    />
                  </div>
                );
              })}
            </div>

            {/* Mobile Toggle Button */}
            {isMobile && (
              <button
                onClick={() => setIsManualExpanded(!isManualExpanded)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
                  isManualExpanded
                    ? "bg-indigo-600 border-indigo-500 text-white rotate-180"
                    : "bg-white dark:bg-[#111] border-gray-200 dark:border-[#1c1c1c] text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-white"
                }`}
                aria-label={
                  isManualExpanded ? "Collapse platforms" : "Expand platforms"
                }
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* <div className="h-5 w-px bg-gray-200 dark:bg-[#1c1c1c] hidden sm:block" /> */}
        </div>

        {/* Right side: active chips + counter */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sort dropdown */}
          <SortDropdown
            options={SORT_TABS}
            activeTab={activeTab}
            onSelect={(tab) => {
              setActiveTab(tab);
              filters.setSortBy(tab);
            }}
          />

          {/* Date filter dropdown */}
          <DateFilterDropdown
            dateAdSeen={filters.dateAdSeen}
            setDateAdSeen={filters.setDateAdSeen}
            datePostSeen={filters.datePostSeen}
            setDatePostSeen={filters.setDatePostSeen}
            dateDomainReg={filters.dateDomainReg}
            setDateDomainReg={filters.setDateDomainReg}
            activeDateFilters={filters.activeDateFilters}
          />

          {filters.selCategories.map((c) => (
            <FilterChip
              key={c}
              label={c}
              onRemove={() =>
                filters.setSelCategories(
                  filters.selCategories.filter((x) => x !== c),
                )
              }
            />
          ))}
          {filters.selCountries.map((c) => (
            <FilterChip
              key={c}
              label={c}
              onRemove={() =>
                filters.setSelCountries(
                  filters.selCountries.filter((x) => x !== c),
                )
              }
            />
          ))}
          {filters.selAdTypes.map((c) => (
            <FilterChip
              key={c}
              label={c}
              onRemove={() =>
                filters.setSelAdTypes(filters.selAdTypes.filter((x) => x !== c))
              }
            />
          ))}

          <div className="px-3 py-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1c1c1c] rounded-lg">
            <span className="text-[10px] font-bold text-[#888] uppercase tracking-widest">
              {activePlatform} · 3.6M ads
            </span>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="flex items-center gap-2 mb-5">
        <LayoutGrid size={15} className="text-gray-400 dark:text-[#888]" />
        <h2 className="text-sm font-bold text-gray-700 dark:text-[#aaa]">
          Marketplace Intelligence
        </h2>
        <span className="text-gray-300 dark:text-[#333] text-xs">·</span>
        <span className="text-[11px] text-gray-500 dark:text-[#666]">
          {filters.sortBy} · {activePlatform}
          {activeCategory !== "all"
            ? ` · ${AD_CATEGORIES.find((c) => c.id === activeCategory)?.label}`
            : ""}
        </span>
        {filters.totalActiveFilters > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded font-bold">
            {filters.totalActiveFilters} filters active
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} onAnalyze={onAnalyzeAd} />
        ))}
      </div>
    </div>
  );
};

export default AdGrid;
