import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gasoneclick_recent_searches';
const MAX_ITEMS = 5;

export function useRecentSearches() {
    const [searches, setSearches] = useState([]);

    useEffect(() => {
        try {
            const item = localStorage.getItem(STORAGE_KEY);
            if (item) {
                setSearches(JSON.parse(item));
            }
        } catch (e) {
            console.error("Error al leer de localStorage", e);
        }
    }, []);

    const saveSearch = (newSearch) => {
        try {
            setSearches((prev) => {
                const filtered = prev.filter(
                    (s) => Math.abs(s.lat - newSearch.lat) > 0.005 || Math.abs(s.lng - newSearch.lng) > 0.005
                );

                const updated = [
                    {
                        id: `search_${Date.now()}`,
                        ...newSearch,
                        last_used: new Date().toISOString()
                    },
                    ...filtered
                ].slice(0, MAX_ITEMS);

                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        } catch (e) {
            console.error("Error al guardar en localStorage", e);
        }
    };

    const removeSearch = (id) => {
        setSearches((prev) => {
            const updated = prev.filter((s) => s.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return { searches, saveSearch, removeSearch };
}