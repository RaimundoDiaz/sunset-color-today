"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useSunsetStore, type LocationData } from "@/store/useSunsetStore";
import { t } from "@/constants/translations";

interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
  country_code: string;
  admin1?: string;
  population?: number;
}

export function LocationSearch() {
  const location = useSunsetStore((s) => s.location);
  const setLocation = useSunsetStore((s) => s.setLocation);
  const locale = useSunsetStore((s) => s.locale);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const displayName = location.admin1
    ? `${location.name}, ${location.admin1}, ${location.country}`
    : `${location.name}, ${location.country}`;

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/geocoding?name=${encodeURIComponent(q)}&lang=${locale}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [locale]);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 250);
  };

  const handleSelect = (r: GeoResult) => {
    const loc: LocationData = {
      name: r.name,
      country: r.country,
      admin1: r.admin1,
      lat: r.latitude,
      lon: r.longitude,
      tz: r.timezone,
    };
    setLocation(loc);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const openSearch = () => {
    setIsOpen(true);
    setQuery("");
    // Focus input on next tick after it mounts
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pill: collapsed (button) or expanded (input) */}
      <div className="flex items-center gap-1 bg-white/10 border-[0.5px] border-white/60 rounded-full p-1 w-full h-8 overflow-hidden">
        {/* Icon box — magnifying glass */}
        <div className="flex items-center justify-center shrink-0 w-[22.627px] h-[22.627px]">
          <Search size={14} strokeWidth={2} className="text-white" />
        </div>

        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder={displayName}
            onChange={(e) => handleInput(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-white text-[14px] md:text-[14px] font-medium tracking-[-0.4px] outline-none placeholder:text-white/70"
          />
        ) : (
          <button
            onClick={openSearch}
            className="flex-1 text-left text-white text-[12px] md:text-[14px] font-medium tracking-[-0.4px] truncate pr-2"
          >
            {displayName}
          </button>
        )}

        {isSearching && (
          <div className="shrink-0 mr-2 w-3 h-3 border-[1.5px] border-white/15 border-t-white/70 rounded-full animate-spin" />
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/15 shadow-lg overflow-hidden z-50 max-h-[280px] overflow-y-auto">
          {results.map((r) => {
            const pop = r.population
              ? r.population > 1_000_000
                ? `${(r.population / 1_000_000).toFixed(1)}M`
                : r.population > 1000
                  ? `${(r.population / 1000).toFixed(0)}K`
                  : `${r.population}`
              : null;

            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm text-white/90 font-medium truncate">{r.name}</div>
                  <div className="text-[11px] text-white/40 truncate">
                    {r.admin1 ? `${r.admin1}, ` : ""}{r.country}
                  </div>
                </div>
                {pop && (
                  <span className="text-[10px] text-white/25 shrink-0">{pop}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/15 shadow-lg p-4 z-50">
          <p className="text-sm text-white/40 text-center">
            {t(locale, "noResults")}
          </p>
        </div>
      )}
    </div>
  );
}
