"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Company } from "@/utils/interfaces";
import SummaryCard from "@/components/commons/SummaryCard";
import { baseURL } from "@/components/constants";
import { indianLanguages } from "@/utils/languages"; // ✅ import languages

export default function CompanyPage() {
  const params = useParams();
  const companyId = params?.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [summary, setSummary] = useState("");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [summaryVariant, setSummaryVariant] = useState<"visit" | "call" | null>(
    null
  );
  const [language, setLanguage] = useState("English"); // default English

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/get-company-data?id=${companyId}`
        );
        setCompany(res.data.data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompany();
  }, [companyId]);

  // Typing effect
  // useEffect(() => {
  //   console.log(summary);
  //   if (!summary) return;
  //   setDisplayedSummary("");
  //   let i = 0;
  //   const interval = setInterval(() => {
  //     setDisplayedSummary((prev) => prev + summary[i]);
  //     i++;
  //     if (i >= summary.length-1) clearInterval(interval);
  //   }, 15);
  //   return () => clearInterval(interval);
  // }, [summary]);

  // Typing effect
  useEffect(() => {
    if (!summary) return;
    console.log(summary);
    setDisplayedSummary(""); // reset before typing
    let i = 0;

    const interval = setInterval(() => {
      if (i < summary.length) {
        setDisplayedSummary((prev) => prev + summary.charAt(i));
        i++;
      } else {
        clearInterval(interval); // stop when finished
      }
    }, 15); // speed (ms per character)

    return () => clearInterval(interval);
  }, [summary]);


  const handleAction = async (type: "visit" | "call") => {
    try {
      if (type === "call") {
        const res = await axios.post(`${baseURL}/summary-calls`, {
          id: companyId,
          language, // ✅ send selected language
        });
        setSummary(res.data);
        setSummaryVariant("call");
      } else {
        const res = await axios.post(`${baseURL}/summary-visits`, {
          id: companyId,
          language, // ✅ send selected language
        });
        setSummary(" \n "+res.data+" \n ");
        setSummaryVariant("visit");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!company) return <div className="p-6 text-neutral-300">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {company.name}
          </h1>
          {company.email && (
            <p className="mt-1 text-sm text-neutral-400">{company.email}</p>
          )}
        </div>

        {/* ✅ Language Dropdown */}
        <div className="flex shrink-0 gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="en">English</option>
            {indianLanguages.map((lang) => (
              <option key={lang.code} value={lang.name}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>


          <button
            onClick={() => handleAction("visit")}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Visit Summary
          </button>
          <button
            onClick={() => handleAction("call")}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Call Summary
          </button>
        </div>
      </div>

      {/* Company Details */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { label: "Partner Type", value: company.cf_partnertag },
          { label: "Created At", value: company.created_at },
          { label: "Updated At", value: company.updated_at },
          {
            label: "Owner Assigned Date",
            value: company.owner_assigned_date || "N/A",
          },
          { label: "Domain", value: company.domain || "N/A" },
          { label: "City", value: company.city || "N/A" },
          { label: "State", value: company.state || "N/A" },
          { label: "Postal Code", value: company.postal_code || "N/A" },
          { label: "Country Zone", value: company.cf_country_zone ?? "N/A" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition-colors hover:bg-neutral-900/60"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              {item.label}
            </p>
            <p className="mt-1 break-words text-base font-semibold text-neutral-100">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      {displayedSummary && (
        <div className="mt-6">
          <SummaryCard content={displayedSummary} variant={summaryVariant} />
        </div>
      )}
    </div>
  );
}
