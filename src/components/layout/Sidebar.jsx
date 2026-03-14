import React from "react";
import {
  LayoutGrid,
  BarChart2,
  Hash,
  BrainCircuit,
  ChevronRight,
  ThumbsUp,
  Share2,
  MessageSquare,
  Eye,
  X,
} from "lucide-react";
import NavItem from "../shared/NavItem";
import SectionLabel from "../shared/SectionLabel";
import SidebarDivider from "../shared/SidebarDivider";
import RangeFilter from "../filters/RangeFilter";
import FilterCheckboxList from "../filters/FilterCheckboxList";
import FilterRadioList from "../filters/FilterRadioList";
import CategorySearchFilter from "../filters/CategorySearchFilter";
import { FILTER_OPTIONS } from "../../constants";

const Sidebar = ({ isOpen, setIsSidebarOpen, filters, onGenerateStrategy }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
                    fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:hidden"}
                    ${isOpen ? "w-64" : "w-0"} 
                    bg-[#0a0a0a] border-r border-[#1c1c1c] overflow-y-auto scrollbar-hide flex-shrink-0
                `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-3 right-2 p-1 text-[#888] hover:text-white/60 hover:bg-white/10 rounded-xl z-[60]"
        >
          <X size={20} />
        </button>

        <div className="py-2">
          {/* Nav */}
          <SectionLabel label="Explore" />
          <div className="px-2 space-y-0.5">
            <NavItem
              icon={<LayoutGrid size={14} />}
              label="All Projects"
              active
            />
            <NavItem icon={<BarChart2 size={14} />} label="Live Engagements" />
            <NavItem icon={<Hash size={14} />} label="Affiliate Networks" />
          </div>

          <SidebarDivider />

          {/* AI */}
          <SectionLabel label="AI" />
          <div className="px-2">
            <button
              onClick={onGenerateStrategy}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 transition-all border border-indigo-500/10"
            >
              <div className="flex items-center gap-2">
                <BrainCircuit size={13} /> Campaign Genie
              </div>
              <ChevronRight size={11} className="opacity-40" />
            </button>
          </div>

          <SidebarDivider />

          {/* Discovery */}
          <SectionLabel label="Discovery" />
          <div className="space-y-4 mb-4">
            <CategorySearchFilter
              label="Category"
              options={FILTER_OPTIONS.categories}
              selected={filters.selCategories}
              onChange={filters.setSelCategories}
            />
            <SidebarDivider />
            <FilterCheckboxList
              label="Ad Type"
              options={FILTER_OPTIONS.adTypes}
              selected={filters.selAdTypes}
              onChange={filters.setSelAdTypes}
            />
            <SidebarDivider />
            <FilterCheckboxList
              label="Call to Action"
              options={FILTER_OPTIONS.ctas}
              selected={filters.selCTAs}
              onChange={filters.setSelCTAs}
            />
            <SidebarDivider />
            <FilterCheckboxList
              label="Country"
              options={FILTER_OPTIONS.countries}
              selected={filters.selCountries}
              onChange={filters.setSelCountries}
            />
          </div>

          <SidebarDivider />

          {/* Engagement */}
          <SectionLabel label="Engagement" />
          <div className="space-y-0.5">
            <RangeFilter icon={<ThumbsUp size={11} />} label="Likes" />
            <RangeFilter icon={<Share2 size={11} />} label="Shares" />
            <RangeFilter icon={<MessageSquare size={11} />} label="Comments" />
            <RangeFilter icon={<Eye size={11} />} label="Impressions" />
          </div>

          <SidebarDivider />

          {/* Time */}
          <SectionLabel label="Time" />
          <div className="space-y-4 mb-4">
            <FilterRadioList
              label="Ad Seen"
              value={filters.adSeen}
              options={FILTER_OPTIONS.adSeen}
              onChange={filters.setAdSeen}
            />
            <SidebarDivider />
            <FilterRadioList
              label="Post Date"
              value={filters.postDate}
              options={FILTER_OPTIONS.postDate}
              onChange={filters.setPostDate}
            />
            <SidebarDivider />
            <FilterRadioList
              label="Domain Age"
              value={filters.domainAge}
              options={FILTER_OPTIONS.domainAge}
              onChange={filters.setDomainAge}
            />
          </div>

          <SidebarDivider />

          {/* Lander */}
          <SectionLabel label="Lander & Affiliates" />
          <div className="space-y-4 mb-4">
            <FilterCheckboxList
              label="Ecommerce"
              options={FILTER_OPTIONS.ecommerce}
              selected={filters.selEcommerce}
              onChange={filters.setSelEcommerce}
            />
            <SidebarDivider />
            <FilterCheckboxList
              label="Funnel Builder"
              options={FILTER_OPTIONS.funnels}
              selected={filters.selFunnels}
              onChange={filters.setSelFunnels}
            />
            <SidebarDivider />
            <FilterCheckboxList
              label="Affiliate Network"
              options={FILTER_OPTIONS.affiliates}
              selected={filters.selAffiliates}
              onChange={filters.setSelAffiliates}
            />
          </div>

          {/* Clear All */}
          {filters.totalActiveFilters > 0 && (
            <div className="px-3 py-4">
              <button
                onClick={filters.clearAll}
                className="w-full text-[10px] text-[#888] hover:text-red-400 transition-colors border border-[#1e1e1e] rounded-lg py-1.5 hover:border-red-500/20"
              >
                Clear {filters.totalActiveFilters} filter
                {filters.totalActiveFilters !== 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
