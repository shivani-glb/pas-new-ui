import { useState } from 'react';

/**
 * useFilters
 * Centralises every filter state value and provides helpers.
 * Returns state, setters, totalActiveFilters count, and clearAll().
 */
export const useFilters = () => {
    // Multi-select filters
    const [selCategories, setSelCategories] = useState([]);
    const [selAdTypes, setSelAdTypes] = useState([]);
    const [selCTAs, setSelCTAs] = useState([]);
    const [selCountries, setSelCountries] = useState([]);
    const [selEcommerce, setSelEcommerce] = useState([]);
    const [selFunnels, setSelFunnels] = useState([]);
    const [selAffiliates, setSelAffiliates] = useState([]);

    // Engagement range filters: [min, max]
    const [likesRange, setLikesRange] = useState([0, 100000]);
    const [sharesRange, setSharesRange] = useState([0, 100000]);
    const [commentsRange, setCommentsRange] = useState([0, 100000]);
    const [impressionsRange, setImpressionsRange] = useState([0, 1000000]);

    // Single-select filters
    const [adSeen, setAdSeen] = useState('Anytime');
    const [postDate, setPostDate] = useState('Last 30 Days');
    const [domainAge, setDomainAge] = useState('All Ages');
    const [sortBy, setSortBy] = useState('Newest');

    // Date range filters: { start: Date|null, end: Date|null }
    const [dateAdSeen, setDateAdSeen] = useState({ start: null, end: null });
    const [datePostSeen, setDatePostSeen] = useState({ start: null, end: null });
    const [dateDomainReg, setDateDomainReg] = useState({ start: null, end: null });

    const activeDateFilters =
        (dateAdSeen.start || dateAdSeen.end ? 1 : 0) +
        (datePostSeen.start || datePostSeen.end ? 1 : 0) +
        (dateDomainReg.start || dateDomainReg.end ? 1 : 0);

    const totalActiveFilters =
        selCategories.length + selAdTypes.length + selCTAs.length +
        selCountries.length + selEcommerce.length + selFunnels.length +
        selAffiliates.length + activeDateFilters;

    const clearAll = () => {
        setSelCategories([]);
        setSelAdTypes([]);
        setSelCTAs([]);
        setSelCountries([]);
        setSelEcommerce([]);
        setSelFunnels([]);
        setSelAffiliates([]);
        setDateAdSeen({ start: null, end: null });
        setDatePostSeen({ start: null, end: null });
        setDateDomainReg({ start: null, end: null });
    };

    return {
        // Multi-select state + setters
        selCategories, setSelCategories,
        selAdTypes, setSelAdTypes,
        selCTAs, setSelCTAs,
        selCountries, setSelCountries,
        selEcommerce, setSelEcommerce,
        selFunnels, setSelFunnels,
        selAffiliates, setSelAffiliates,

        // Engagement ranges
        likesRange, setLikesRange,
        sharesRange, setSharesRange,
        commentsRange, setCommentsRange,
        impressionsRange, setImpressionsRange,

        // Single-select state + setters
        adSeen, setAdSeen,
        postDate, setPostDate,
        domainAge, setDomainAge,
        sortBy, setSortBy,

        // Date range filters
        dateAdSeen, setDateAdSeen,
        datePostSeen, setDatePostSeen,
        dateDomainReg, setDateDomainReg,
        activeDateFilters,

        // Derived
        totalActiveFilters,
        clearAll,
    };
};
