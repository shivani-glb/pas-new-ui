import React from "react";
import { LayoutGrid } from "lucide-react";
import AdCard from "./AdCard";
import PlatformTab from "../shared/PlatformTab";
import FilterChip from "../filters/FilterChip";
import SortDropdown from "../filters/SortDropdown";
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
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-[#0a0a0a] p-5">
      {/* Toolbar row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Platform tabs */}
          <div className="flex items-center gap-0.5 p-1 bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-[#1c1c1c]">
            {PLATFORMS.map((p) => (
              <PlatformTab
                key={p.id}
                Icon={p.Icon}
                label={p.label}
                active={activePlatform === p.id}
                onClick={() => setActivePlatform(p.id)}
                color={p.color}
              />
            ))}
          </div>

          <div className="h-5 w-px bg-gray-200 dark:bg-[#1c1c1c] hidden sm:block" />

          {/* Sort dropdown */}
          <SortDropdown
            options={SORT_TABS}
            activeTab={activeTab}
            onSelect={(tab) => {
              setActiveTab(tab);
              filters.setSortBy(tab);
            }}
          />
        </div>

        {/* Right side: active chips + counter */}
        <div className="flex items-center gap-2 flex-wrap">
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
