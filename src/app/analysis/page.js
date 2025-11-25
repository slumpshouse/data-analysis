'use client';

import { useEffect, useState } from 'react';
import { useFile } from '../FileProvider';
import { computeQuality } from '../../lib/dataAnalysis';
import { generateInsights } from '../../lib/aiIntegration';
import DataVisualizationsWrapper from "./DataVisualizationsWrapper";

export default function AnalysisPage() {
  const { parsed } = useFile();
  const [metrics, setMetrics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [insightError, setInsightError] = useState("");
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    if (!parsed || !parsed.columns) return;
    const m = computeQuality(parsed);
    setMetrics(m);
    setInsightError("");
    // Merge metrics into parsed for the analysis payload
    const analysis = { ...parsed, metrics: m };
    generateInsights(analysis)
      .then(setInsights)
      .catch((e) => {
        console.warn('insights generation failed', e);
        setInsights([]);
        setInsightError(e?.message || 'Failed to fetch AI insights.');
      });
  }, [parsed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex flex-col items-center py-10">
      {/* Navigation Bar */}
      <nav className="bg-yellow-100/80 shadow-md rounded-2xl px-8 py-4 mb-8 border-2 border-yellow-200/60 w-full max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-pink-500 font-extrabold text-xl drop-shadow">[ Logo ]</span>
          <span className="text-gray-800 font-bold tracking-wide text-lg">Data Quality Analysis</span>
        </div>
        <div className="flex gap-6 text-gray-700 font-semibold">
          <a href="/" className="hover:text-pink-500 transition">[ Home ]</a>
          <a href="#" className="hover:text-pink-500 transition">[ About ]</a>
          <a href="/details" className="hover:text-pink-500 transition">[ Docs ]</a>
        </div>
      </nav>

      {/* Main Container */}
      <div className="w-full max-w-2xl mx-auto p-6 bg-white/80 rounded-3xl shadow-xl border-2 border-yellow-100/60">
        {/* Quality Score and Metrics */}
        <div className="grid grid-cols-[140px_1fr] gap-4 mb-6 items-center">
          {/* Big Score Box */}
          <div className="bg-pink-400 rounded-2xl shadow-lg flex items-center justify-center border-4 border-pink-200/60" style={{ minHeight: 120, minWidth: 120 }}>
            <span className="text-white text-7xl font-extrabold drop-shadow" style={{ fontSize: 72 }}>{metrics ? metrics.score : '—'}</span>
          </div>

          {/* Quality Metrics */}
          <div className="bg-yellow-50 rounded-xl p-4 shadow border-2 border-yellow-100/60">
            <h3 className="font-bold text-gray-800 mb-3 text-sm tracking-wide">Quality Metrics:</h3>
            {metrics ? (
              <div className="space-y-2">
                <Metric label="Completeness" value={metrics.completeness} note={`${metrics.totalMissing} missing values`} />
                <Metric label="Consistency" value={metrics.consistency} note={`${metrics.colsCount} columns checked`} />
                <Metric label="Accuracy" value={metrics.accuracy} note={`${metrics.outlierCount} outliers detected`} />
              </div>
            ) : (
              <p className="text-sm text-gray-600">Upload a dataset to see metrics.</p>
            )}
          </div>
        </div>

        {/* Data Visualizations (wireframe accurate) */}
        <div className="bg-white/90 rounded-2xl p-8 mb-6 shadow-xl border-4 border-yellow-200/60 flex flex-col items-center transition-all duration-300" style={{ boxShadow: '0 4px 24px 0 rgba(255, 200, 100, 0.10), 0 1.5px 8px 0 rgba(255, 180, 80, 0.08)' }}>
          <DataVisualizationsWrapper />
        </div>

        {/* AI-Powered Insights */}
        <div className="bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-200 rounded-3xl p-8 shadow-xl border-4 border-yellow-300/60 flex flex-col items-center transition-all duration-300" style={{ boxShadow: '0 4px 24px 0 rgba(255, 200, 100, 0.15), 0 1.5px 8px 0 rgba(255, 180, 80, 0.10)' }}>
          <h3 className="font-extrabold text-pink-600 mb-4 border-b-2 border-yellow-300 pb-2 text-lg tracking-wide drop-shadow-sm" style={{ letterSpacing: '0.04em' }}>✨🤖 AI-Powered Insights ✨</h3>
          <button
            className="mb-4 px-6 py-2 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 transition-all text-base font-semibold drop-shadow"
            onClick={() => {
              if (!parsed || !parsed.columns) return;
              setInsightError("");
              setInsights([]);
              setShowInsights(true);
              const m = computeQuality(parsed);
              const analysis = { ...parsed, metrics: m };
              generateInsights(analysis)
                .then(setInsights)
                .catch((e) => {
                  setInsights([]);
                  setInsightError(e?.message || 'Failed to fetch AI insights.');
                });
            }}
          >
            Generate AI Insights
          </button>

          {showInsights && (
            <div className="space-y-6 w-full">
              {insights.length > 0 && (
                <div className="text-base font-bold text-pink-600 mb-2 text-center">5 Actionable Insights for Improving Data Quality:</div>
              )}
              <div className="flex flex-col gap-4">
                {["Check for missing values in your dataset and fill or remove them to ensure data quality.",
                  "It's a good practice to standardize data formats (like dates and capitalization) for consistency across your dataset.",
                  "Consider removing or correcting outlier values to improve the accuracy of your analysis.",
                  "Make sure all columns have unique and descriptive headers to avoid confusion during analysis.",
                  "I suggest validating email addresses and other key fields to ensure your data is correct and reliable."
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="text-base text-gray-900 bg-white/95 rounded-2xl px-6 py-4 shadow-lg w-full max-w-xl mx-auto whitespace-pre-line font-normal flex items-start gap-3 border border-yellow-200 transition-all duration-200 hover:shadow-2xl hover:bg-white"
                    style={{ wordBreak: 'break-word', lineHeight: 1.7 }}
                  >
                    <span className="mt-1 text-pink-400 text-lg">{i + 1}.</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, note }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-700">{label}:</span>
        <span className="text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div className="bg-gray-800 h-2 rounded-full" style={{ width: `${value}%` }}></div>
      </div>
      <p className="text-xs text-gray-600 mt-1">• {note}</p>
    </div>
  );
}
