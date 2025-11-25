"use client";

import { useState, useEffect } from "react";
import { useFile } from "../FileProvider.jsx";

// Helper to check if two objects are shallowly equal
function shallowEqual(a, b) {
  if (!a || !b) return false;
  const aCols = a.columns || [], bCols = b.columns || [];
  if (aCols.length !== bCols.length) return false;
  for (let i = 0; i < aCols.length; i++) if (aCols[i] !== bCols[i]) return false;
  return true;
}

export default function DetailsPage() {
  const { parsed, setParsed, setUploadedFile } = useFile();
  const [open, setOpen] = useState({});
  const [hasPrev, setHasPrev] = useState(false);

  // Check for previous data in sessionStorage
  useEffect(() => {
    try {
      const prevParsedRaw = sessionStorage.getItem("uploadedParsed");
      if (prevParsedRaw) {
        const prevParsed = JSON.parse(prevParsedRaw);
        setHasPrev(!shallowEqual(parsed, prevParsed));
      } else {
        setHasPrev(false);
      }
    } catch {
      setHasPrev(false);
    }
  }, [parsed]);

  // Handler to load previous data
  function handleLoadPrevious() {
    try {
      const prevParsedRaw = sessionStorage.getItem("uploadedParsed");
      const prevFileRaw = sessionStorage.getItem("uploadedFile");
      if (prevParsedRaw) setParsed(JSON.parse(prevParsedRaw));
      if (prevFileRaw) setUploadedFile(JSON.parse(prevFileRaw));
    } catch (err) {
      // fallback: do nothing
    }
  }

  // Set default open state - open for columns with issues, closed for clean ones
  useEffect(() => {
    if (parsed && parsed.columns) {
      const initial = {};
      parsed.columns.forEach((col) => {
        const stats = getColStats(col);
        const type = guessType(col);
        const hasMissing = stats.missing > 0;
        const hasOutliers = type === "Integer" && parsed.rows.some((r) => Number(r[col]) > 120 || Number(r[col]) < 0);
        const hasIssues = hasMissing || hasOutliers;
        initial[col] = hasIssues; // Open if has issues, closed if clean
      });
      setOpen(initial);
    }
  }, [parsed]);

  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  // Helper to get stats for a column
  function getColStats(col) {
    return parsed.stats?.find((s) => s.col === col) || { missing: 0, unique: 0 };
  }

  // Helper to get type guess
  function guessType(col) {
    if (!parsed.rows?.length) return "Unknown";
    const sample = parsed.rows.find((r) => r[col] != null && r[col] !== "");
    if (!sample) return "Unknown";
    const val = sample[col];
    if (!isNaN(Number(val))) return "Integer";
    if (typeof val === "string" && val.includes("@")) return "Email";
    return "Text";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex flex-col items-center py-10">
      {hasPrev && (
        <button
          className="mb-4 px-5 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow border-2 border-yellow-200/60 transition-all"
          onClick={handleLoadPrevious}
        >
          Load Previous Data
        </button>
      )}
      <nav className="bg-yellow-100/80 shadow-md rounded-2xl px-8 py-4 mb-8 border-2 border-yellow-200/60 w-full max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-pink-500 font-extrabold text-xl drop-shadow">[ Logo ]</span>
          <span className="text-gray-800 font-bold tracking-wide text-lg">Data Quality Analysis</span>
        </div>
        <div className="flex gap-6 text-gray-700 font-semibold">
          <a href="/" className="hover:text-pink-500 transition">[ Home ]</a>
          <a href="/preview" className="hover:text-pink-500 transition">[ Preview ]</a>
          <a href="/details" className="hover:text-pink-500 transition">[ Docs ]</a>
        </div>
      </nav>

      <div className="w-full max-w-2xl mx-auto p-6 bg-white/80 rounded-3xl shadow-xl border-2 border-yellow-100/60">
        <h1 className="text-3xl font-extrabold text-pink-600 mb-6 drop-shadow text-center">Detailed Insights</h1>
        
        {/* Debug info */}
        <div className="mb-4 text-sm text-gray-600 text-center">
          {parsed.columns ? `Found ${parsed.columns.length} columns` : 'No columns found'}
          {parsed.rows ? ` with ${parsed.rows.length} rows` : ' with no rows'}
        </div>

        {parsed.columns && parsed.columns.length > 0 ? (
          parsed.columns.map((col) => {
            const stats = getColStats(col);
            const type = guessType(col);
            const hasMissing = stats.missing > 0;
            const hasOutliers = type === "Integer" && parsed.rows.some((r) => Number(r[col]) > 120 || Number(r[col]) < 0);
            const issuesCount = (hasMissing ? 1 : 0) + (hasOutliers ? 1 : 0);
            const hasIssues = issuesCount > 0;
            
            // Card color logic using your CSS classes
            let cardColor = "bg-cyan-100 hover:bg-cyan-200 border-cyan-200";
            if (hasMissing) cardColor = "bg-amber-100 hover:bg-amber-200 border-yellow-200";
            if (hasOutliers) cardColor = "bg-rose-100 hover:bg-rose-200 border-rose-200";
            if (!hasIssues) cardColor = "bg-teal-100 hover:bg-teal-200 border-teal-200";
            
            // Icon logic
            let icon = hasIssues ? '▼' : '■';
            let iconColor = hasMissing ? 'text-yellow-600' : hasOutliers ? 'text-rose-600' : 'text-teal-600';
            
            // Issue text
            let issueText = hasIssues ? `${issuesCount} Issue${issuesCount > 1 ? 's' : ''} Found` : 'No Issues ✓';
            
            const isOpen = open[col];
            
            return (
              <div className="mb-6" key={col}>
                <button
                  className={`w-full text-left rounded-2xl p-4 flex items-center gap-3 shadow-xl border-2 transition-all text-lg font-semibold ${cardColor}`}
                  onClick={() => toggle(col)}
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-lg ${iconColor}`}>{icon}</span>
                  <span className="text-gray-800">Column: {col} ({type}) - {issueText}</span>
                  <span className="ml-auto text-gray-500">{isOpen ? '▾' : '▸'}</span>
                </button>
                {isOpen && (
                  <div className="border rounded-b-2xl p-5 bg-white/95 shadow-inner mt-1">
                    <div className="border-b border-gray-300 pb-3 mb-3">
                      <p className="font-semibold text-pink-600 mb-1">Analysis Details:</p>
                      <ul className="list-disc ml-6 mt-2 text-base text-gray-700">
                        <li>Type: {type === 'Integer' ? 'Integer (Numeric)' : 'Text (String)'}</li>
                        <li>Missing Values: {stats.missing} out of {parsed.rows.length} ({parsed.rows.length ? ((stats.missing/parsed.rows.length)*100).toFixed(0) : 0}%)</li>
                        <li>Unique Values: {stats.unique}</li>
                        {type === 'Integer' && (
                          <>
                            <li>Outliers: {parsed.rows.filter((r) => Number(r[col]) > 120 || Number(r[col]) < 0).length} (e.g. &gt; 120, likely error)</li>
                            <li>Range: {(() => {
                              const nums = parsed.rows.map(r => Number(r[col])).filter(n => !isNaN(n));
                              if (!nums.length) return 'N/A';
                              return `${Math.min(...nums)}-${Math.max(...nums)} (expected: 18-100)`;
                            })()}</li>
                          </>
                        )}
                        {type === 'Text' && <li>Duplicates: {(() => {
                          const vals = parsed.rows.map(r => r[col]).filter(v => v != null && v !== '');
                          const counts = vals.reduce((acc, v) => { acc[v] = (acc[v]||0)+1; return acc; }, {});
                          return Object.values(counts).filter(c => c > 1).length;
                        })()}</li>}
                      </ul>
                    </div>
                    {hasIssues && (
                      <div>
                        <p className="font-semibold text-pink-600 mb-1">Suggested Fixes:</p>
                        <ol className="ml-6 list-decimal text-base text-gray-700">
                          {hasMissing && (
                            <li>Fill missing values {type === 'Text' ? 'with "Unknown"' : 'with median (53)'} or remove rows</li>
                          )}
                          {type === 'Text' && (
                            <li>Standardize name format (Title Case)</li>
                          )}
                          {hasOutliers && (
                            <li>Remove or correct outlier value (e.g. &gt; 120)</li>
                          )}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500">
            <p className="mb-4">No data loaded. Please upload a file and run analysis.</p>
            <div className="flex gap-2 justify-center">
              <a href="/preview" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full">
                Go to Upload
              </a>
              <button
                onClick={() => {
                  // Load sample data for testing
                  setParsed({
                    columns: ['Name', 'Age', 'Email', 'City'],
                    rows: [
                      { Name: 'John', Age: 25, Email: 'john@email.com', City: 'NYC' },
                      { Name: '', Age: 130, Email: 'jane@email.com', City: 'LA' },
                      { Name: 'Bob', Age: 30, Email: '', City: 'Chicago' }
                    ],
                    stats: [
                      { col: 'Name', missing: 1, unique: 2 },
                      { col: 'Age', missing: 0, unique: 3 },
                      { col: 'Email', missing: 1, unique: 2 },
                      { col: 'City', missing: 0, unique: 3 }
                    ]
                  });
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-full"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
