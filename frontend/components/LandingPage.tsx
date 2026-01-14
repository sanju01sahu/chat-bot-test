"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import debounce from "lodash/debounce";
import { Company } from "@/utils/interfaces";
import { baseURL } from "@/components/constants";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Company[]>([]);
  const [results, setResults] = useState<Company[]>([]);
  const router = useRouter();

  // Debounced search API
  const fetchSuggestions = useCallback(
    debounce(async (q: string) => {
      if (!q) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`${baseURL}/companies?search=${q}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 400),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${baseURL}/companies?search=${query}`);
      setResults(res.data);
      setSuggestions([]); // hide dropdown
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCompany = (companyId: number) => {
    router.push(`/company/${companyId}`);
  };

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-5xl flex-col items-center justify-center px-4 bg-[#F1F5F9]">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-slate-900">
          Find Your Next Pitch to Close the Deal With Nosky
          <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
            {" "}
            AI
          </span>
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Search by name and jump straight into enriched details and summaries.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mt-8 w-full max-w-2xl">
        <div className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400">
          <svg
            className="ml-1 h-5 w-5 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.3-4.3M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search companies..."
            className="w-full bg-transparent p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Search
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {suggestions.map((c) => (
              <li
                key={c.id}
                onClick={() => handleSelectCompany(c.id)}
                className="cursor-pointer px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className="mt-8 w-full max-w-2xl">
        {results.length > 0 && (
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
            Results
          </div>
        )}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {results.map((c, idx) => (
            <button
              type="button"
              key={c.id}
              onClick={() => handleSelectCompany(c.id)}
              className={`flex w-full items-center justify-between px-4 py-3 text-left text-slate-700 transition-colors hover:bg-slate-100 ${
                idx !== results.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <span className="truncate">{c.name}</span>
              <svg
                className="h-4 w-4 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </button>
          ))}
          {results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              Try searching for a company to see results
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
