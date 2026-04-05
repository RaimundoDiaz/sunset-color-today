"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSunsetStore, type LocationData } from "@/store/useSunsetStore";

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
    setIsOpen(true);
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

  // Close dropdown on outside click
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
    <div ref={containerRef} className="relative mb-4">
      <input
        ref={inputRef}
        type="text"
        value={isOpen ? query : ""}
        placeholder={displayName}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => { setIsOpen(true); setQuery(""); }}
        className="w-full bg-white/50 border border-black/10 text-black/80 text-sm rounded-xl py-2.5 px-4 outline-none focus:border-black/25 focus:bg-white/70 transition-colors placeholder:text-black/60"
      />

      {/* Search icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/30">
        {isSearching ? (
          <div className="w-4 h-4 border-2 border-black/15 border-t-black/40 rounded-full animate-spin" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-black/10 shadow-lg overflow-hidden z-50 max-h-[280px] overflow-y-auto">
          {results.map((r) => {
            const parts = [r.name];
            if (r.admin1) parts.push(r.admin1);
            parts.push(r.country);
            const label = parts.join(", ");
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
                className="w-full text-left px-4 py-2.5 hover:bg-black/[0.04] transition-colors flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-sm text-black/80 font-medium">{r.name}</div>
                  <div className="text-[11px] text-black/40">
                    {r.admin1 ? `${r.admin1}, ` : ""}{r.country}
                  </div>
                </div>
                {pop && (
                  <span className="text-[10px] text-black/25 shrink-0">{pop}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-black/10 shadow-lg p-4 z-50">
          <p className="text-sm text-black/40 text-center">
            {locale === "es" ? "Sin resultados" : "No results found"}
          </p>
        </div>
      )}
    </div>
  );
}
