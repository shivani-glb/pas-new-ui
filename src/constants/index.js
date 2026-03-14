// ─── Static Data / Constants ──────────────────────────────────────────────────
// NOTE: Icons are stored as component references (not JSX elements) so this
// file stays a plain .js file. Components render them with <Icon size={n} />.

import {
    Facebook, Instagram, Youtube, Linkedin,
    Search, Globe, MessageSquare, Heart, Play
} from 'lucide-react';

export const PLATFORMS = [
    { id: 'Facebook', label: 'FB', Icon: Facebook, color: 'text-blue-400' },
    { id: 'Instagram', label: 'IG', Icon: Instagram, color: 'text-pink-400' },
    { id: 'YouTube', label: 'YT', Icon: Youtube, color: 'text-red-400' },
    { id: 'LinkedIn', label: 'IN', Icon: Linkedin, color: 'text-blue-500' },
    { id: 'Google', label: 'GGL', Icon: Search, color: 'text-yellow-400' },
    { id: 'Native', label: 'NAT', Icon: Globe, color: 'text-green-400' },
    { id: 'Reddit', label: 'RDT', Icon: MessageSquare, color: 'text-orange-400' },
    { id: 'Pinterest', label: 'PIN', Icon: Heart, color: 'text-rose-400' },
    { id: 'TikTok', label: 'TT', Icon: Play, color: 'text-cyan-400' },
];

export const AD_CATEGORIES = [
    { id: 'all', label: 'All Ads' },
    { id: 'ecom', label: 'Ecommerce' },
    { id: 'finance', label: 'Finance' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'saas', label: 'SaaS' },
    { id: 'health', label: 'Health' },
    { id: 'edu', label: 'Education' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'travel', label: 'Travel' },
    { id: 'realestate', label: 'Real Estate' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'auto', label: 'Automotive' },
];

export const SORT_TABS = ['Newest', 'Popular', 'Running Longest', 'Oldest','Impressions','Likes','Comments','Shares'];

export const FILTER_OPTIONS = {
    categories: ['Ecommerce', 'Finance & Insurance', 'Crypto', 'Clothing & Accessories', 'Education', 'Software & SaaS', 'Health & Fitness', 'Travel', 'Real Estate', 'Gaming', 'Automotive'],
    adTypes: ['Image', 'Video', 'Carousel', 'Story', 'Reel'],
    ctas: ['Shop Now', 'Learn More', 'Sign Up', 'Download', 'Book Now', 'Contact Us', 'Add to Cart', 'Get Offer', 'Watch More', 'Apply Now'],
    countries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Germany', 'France', 'Brazil', 'Singapore', 'UAE', 'South Africa', 'Japan'],
    ecommerce: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Wix', 'Squarespace', 'Prestashop'],
    funnels: ['ClickFunnels', 'LeadPages', 'Kajabi', 'Kartra', 'Instapage', 'GetResponse', 'Convertri', 'Builderall'],
    affiliates: ['ClickBank', 'ShareASale', 'Commission Junction', 'Rakuten', 'MaxBounty', 'PeerFly', 'JVZoo'],
    adSeen: ['Anytime', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'],
    postDate: ['Anytime', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'],
    domainAge: ['All Ages', 'New (< 1 yr)', '1–3 Years', '3–5 Years', '5+ Years'],
};

export const SEARCH_IN_OPTIONS = ['Ad Text', 'Advertiser', 'Keyword', 'Domain'];
