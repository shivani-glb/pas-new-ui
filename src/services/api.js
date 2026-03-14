// ─── API Configuration ────────────────────────────────────────────────────────
const GEMINI_API_KEY = "";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// ─── PAS API Configuration ────────────────────────────────────────────────────
// TODO: Replace with real PAS API base URL when provided
const PAS_API_BASE = "";

// ─────────────────────────────────────────────────────────────────────────────
// Gemini AI Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calls the Gemini API with a text prompt.
 * Includes exponential backoff retry logic (up to 5 retries).
 */
export const fetchGemini = async (prompt, retryCount = 0) => {
    try {
        const response = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) {
            if (response.status === 429 && retryCount < 5) {
                await delay(Math.pow(2, retryCount) * 1000);
                return fetchGemini(prompt, retryCount + 1);
            }
            throw new Error('Failed to connect to AI service');
        }
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
        if (retryCount < 5) {
            await delay(Math.pow(2, retryCount) * 1000);
            return fetchGemini(prompt, retryCount + 1);
        }
        throw error;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PAS Ad Intelligence API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches ads from the PAS API based on filters.
 * TODO: Replace stub with real API call using the endpoint/params you provide.
 *
 * @param {object} filters - Current filter state from useFilters hook
 * @returns {Promise<Array>} Array of ad objects
 */
export const fetchAds = async (filters = {}) => {
    // ── STUB: Simulate API filtering for demonstration ──────────────────────
    const allAds = [
        { id: 1, advertiser: "Crownstreams", date: "6 Mar 2026", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", likes: "3", views: "1", shares: "0", title: "Build multigenerational wealth the right way", subtitle: "Finance / Wealth Management", adType: "Image", country: "US" },
        { id: 2, advertiser: "Cookiebot", date: "6 Mar 2026", thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80", likes: "338", views: "34K", shares: "21", title: "Try Cookiebot for free", subtitle: "SaaS / Compliance", adType: "Image", country: "UK" },
        { id: 3, advertiser: "Discovaz", date: "6 Mar 2026", thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80", likes: "1.8K", views: "1.4M", shares: "312", title: "Get general info on getting started in AI", subtitle: "Education / Technology", adType: "Video", country: "CA" },
        { id: 4, advertiser: "TechFlow", date: "5 Mar 2026", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", likes: "5.2K", views: "2.1M", shares: "890", title: "Scale your SaaS to the moon", subtitle: "B2B Marketing", adType: "Video", country: "US" },
    ];

    const { searchQuery, selCategories, activePlatform } = filters;

    let filtered = allAds;

    // Filter by Platform
    if (activePlatform) {
        // Mock: everything currently in stub is platform-agnostic, but we'll assume it matches
        // In real API, this would be a param.
    }

    // Filter by Query
    if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(ad =>
            ad.title.toLowerCase().includes(q) ||
            ad.advertiser.toLowerCase().includes(q) ||
            ad.subtitle.toLowerCase().includes(q)
        );
    }

    // Filter by Selected Categories
    if (selCategories && selCategories.length > 0) {
        filtered = filtered.filter(ad => {
            // Check if ad subtitle (e.g. "Finance / Wealth Management") 
            // has any overlap with selected categories (e.g. "Finance > Wealth Management")
            return selCategories.some(cat => {
                const normalizedCat = cat.replace(/\s*>\s*/g, ' / ').toLowerCase();
                return ad.subtitle.toLowerCase().includes(normalizedCat) || normalizedCat.includes(ad.subtitle.toLowerCase());
            });
        });
    }

    return filtered;
};

/**
 * Builds an AI audit prompt for a given ad object.
 */
export const buildAuditPrompt = (ad) =>
    `Analyze this ad:\nTitle: "${ad.title}"\nAdvertiser: "${ad.advertiser}"\nCategory: "${ad.subtitle}"\nEngagement: ${ad.likes} likes, ${ad.views} views, ${ad.shares} shares.\n\nBrief bulleted insights on:\n1. Core psychological trigger\n2. Target audience persona\n3. Performance prediction\n4. One improvement tip`;

/**
 * Builds a campaign strategy prompt for a list of ads.
 */
export const buildCampaignPrompt = (ads) =>
    `Based on these ads:\n${ads.map(a => `- ${a.title}`).join('\n')}\n\nGenerate a concise 30-day blitz strategy for a new competitor.`;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise(r => setTimeout(r, ms));
