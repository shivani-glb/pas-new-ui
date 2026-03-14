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

    // Single-select filters
    const [adSeen, setAdSeen] = useState('Anytime');
    const [postDate, setPostDate] = useState('Last 30 Days');
    const [domainAge, setDomainAge] = useState('All Ages');
    const [sortBy, setSortBy] = useState('Newest');

    const totalActiveFilters =
        selCategories.length + selAdTypes.length + selCTAs.length +
        selCountries.length + selEcommerce.length + selFunnels.length +
        selAffiliates.length;

    const clearAll = () => {
        setSelCategories([]);
        setSelAdTypes([]);
        setSelCTAs([]);
        setSelCountries([]);
        setSelEcommerce([]);
        setSelFunnels([]);
        setSelAffiliates([]);
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

        // Single-select state + setters
        adSeen, setAdSeen,
        postDate, setPostDate,
        domainAge, setDomainAge,
        sortBy, setSortBy,

        // Derived
        totalActiveFilters,
        clearAll,
    };
};
