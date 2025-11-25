"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useFile } from '../FileProvider';

export default function PreviewPage() {
  const router = useRouter();
  const { uploadedFile, parsed, uploadAndParse, parsing, progress } = useFile();
  const [fileInfo, setFileInfo] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [stats, setStats] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Always update preview if there are rows, even if columns is empty
    if (parsed && parsed.rows && parsed.rows.length > 0) {
      setFileInfo({ name: uploadedFile?.name || parsed?.name || '(uploaded)' });
      setRows(parsed.rows.slice(0, 100));
      // Use parsed.columns if non-empty, else fallback to keys from first row
      const cols = (parsed.columns && parsed.columns.length > 0)
        ? parsed.columns
        : Object.keys(parsed.rows[0] || {});
      setColumns(cols);
      setStats(parsed.stats || []);
      return;
    }

    // fallback to sessionStorage if provider empty
    const raw = sessionStorage.getItem("uploadedFile");
    if (!raw) return;
    try {
      const parsedRaw = JSON.parse(raw);
      setFileInfo({ name: parsedRaw.name });
      if (parsedRaw.name && parsedRaw.name.toLowerCase().endsWith(".csv")) {
        // parse quickly with built-in CSV fallback
        try {
          const Papa = require('papaparse');
          const res = Papa.parse(parsedRaw.text, { header: true, skipEmptyLines: true });
          const data = res.data || [];
          setRows(data.slice(0, 100));
          const cols = (res.meta.fields && res.meta.fields.length > 0)
            ? res.meta.fields
            : Object.keys(data[0] || {});
          setColumns(cols);
          computeStats(data, cols);
        } catch (err) {
          console.error('fallback CSV parse error', err);
        }
      } else if (parsedRaw.name && parsedRaw.name.toLowerCase().endsWith(".json")) {
        try {
          const obj = JSON.parse(parsedRaw.text);
          const data = Array.isArray(obj) ? obj : [obj];
          setRows(data.slice(0, 100));
          const cols = Object.keys(data[0] || {});
          setColumns(cols);
          computeStats(data, cols);
        } catch (err) {
          console.error("JSON parse error", err);
        }
      } else {
        setRows([{ content: parsedRaw.text.slice(0, 200) }]);
        setColumns(["content"]);
        computeStats([{ content: parsedRaw.text }], ["content"]);
      }
    } catch (err) {
      console.error("uploadedFile parse error", err);
    }
  }, [parsed, uploadedFile]);

  async function loadSample() {
    setErrorMessage("");
    try {
      const resp = await fetch('/datasets/sample-sales.csv');
      if (!resp.ok) throw new Error('Sample dataset not found');
      const blob = await resp.blob();
      const file = new File([blob], 'sample-sales.csv', { type: 'text/csv' });
      const res = await uploadAndParse(file);
      if (!res) setErrorMessage('Sample dataset failed to parse');
    } catch (err) {
      console.error('loadSample error', err);
      setErrorMessage(String(err.message || err));
    }
  }

  function computeStats(data, cols) {
    const statsOut = cols.map((c) => {
      let missing = 0;
      const uniques = new Set();
      data.forEach((r) => {
        const v = r[c];
        if (v === null || v === undefined || String(v).trim() === "") missing++;
        else uniques.add(String(v));
      });
      return { col: c, missing, unique: uniques.size };
    });
    setStats(statsOut);
  }

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
          <a href="/preview" className="hover:text-pink-500 transition">[ Preview ]</a>
          <a href="/details" className="hover:text-pink-500 transition">[ Docs ]</a>
        </div>
      </nav>

      {/* Main Container */}
      <div className="w-full max-w-2xl mx-auto p-6 bg-white/80 rounded-3xl shadow-xl border-2 border-yellow-100/60">
        {/* File Info Header */}
        <div className="bg-white/90 rounded-2xl p-6 mb-6 shadow-xl border-4 border-yellow-200/60 flex flex-col items-center">
          <p className="text-pink-600 font-bold text-lg">File: {fileInfo?.name || "(no file)"}</p>
        </div>

        {/* Progress Bar / Status */}
        <div className="bg-white/90 rounded-2xl p-6 mb-6 shadow-xl border-4 border-yellow-200/60 flex flex-col items-center">
          <p className="text-pink-500 mb-2 font-semibold">{parsing ? 'Analyzing...' : (rows.length>0 ? 'Analysis complete' : 'No analysis yet')}</p>
          <div className="w-full bg-yellow-100 rounded-full h-6 overflow-hidden border-2 border-yellow-200">
            <div className="bg-pink-400 h-6 rounded-full transition-all duration-300" style={{ width: parsing ? `${progress}%` : (rows.length>0 ? '100%' : '0%') }}></div>
          </div>
          <p className="text-pink-500 text-sm mt-1 text-right w-full">{parsing ? `${progress}%` : (rows.length>0 ? 'Done' : '0%')}</p>
        </div>

        {/* Data Preview Table */}
        <div className="bg-white/90 rounded-2xl p-8 mb-6 shadow-xl border-4 border-yellow-200/60 flex flex-col items-center">
          <h3 className="font-extrabold text-pink-600 mb-4 text-lg tracking-wide drop-shadow-sm">Data Preview (First 100 rows)</h3>
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-yellow-200">
                  {(() => {
                    let displayCols = columns && columns.length > 0 ? columns : (rows[0] ? Object.keys(rows[0]) : []);
                    if (displayCols.length === 0) return <th className="text-left p-2 font-semibold bg-white text-pink-600">(no columns)</th>;
                    return displayCols.map((col) => (
                      <th key={col} className="text-left p-2 font-semibold bg-white text-pink-600">{col}</th>
                    ));
                  })()}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td className="p-2 bg-white text-pink-600" colSpan={Math.max(columns.length, 1)}>
                      <div className="mb-2">No rows to preview.</div>
                      <div className="flex gap-2">
                        <button
                          onClick={loadSample}
                          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-3 py-1 rounded-full text-sm shadow"
                        >
                          Load sample dataset
                        </button>
                        <button
                          onClick={() => router.push('/')}
                          className="inline-flex items-center gap-2 bg-white border border-yellow-200 text-pink-600 font-semibold px-3 py-1 rounded-full text-sm shadow"
                        >
                          Back to upload
                        </button>
                      </div>
                      {errorMessage && <div className="text-sm text-red-600 mt-2">{errorMessage}</div>}
                    </td>
                  </tr>
                )}
                {rows.length > 0 && rows.map((r, i) => {
                  let displayCols = columns && columns.length > 0 ? columns : Object.keys(r);
                  return (
                    <tr key={i} className="border-b border-yellow-100">
                      {displayCols.map((col) => (
                        <td key={col} className="p-2 bg-white text-pink-600">{String(r[col] ?? "").slice(0, 100)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 pt-4 border-t border-yellow-200 w-full">
            <h4 className="font-bold text-pink-600 mb-3">Column Statistics:</h4>
            <ul className="space-y-1 text-sm text-pink-600">
              {stats.map((s) => (
                <li key={s.col}>• {s.col}: {s.unique} unique, {s.missing} missing</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Initial Quality Overview */}
        <div className="bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 rounded-2xl p-8 shadow-xl border-4 border-yellow-200/60 flex flex-col items-center">
          <h3 className="font-extrabold text-pink-600 mb-4 border-b-2 border-yellow-300 pb-2 text-lg tracking-wide drop-shadow-sm w-full text-center">Initial Quality Overview</h3>
          <div className="space-y-2 text-sm text-pink-600 w-full">
            <p>Issues detected: {columns.length} columns identified</p>
            <p>Null values found: {stats.reduce((a, b) => a + (b.missing || 0), 0)} total across {stats.filter(s => s.missing>0).length} columns</p>
            <p>Potential issues: {stats.filter(s => s.unique === 0).length} columns with no unique values</p>
          </div>
          <div className="mt-4 pt-4 border-t border-yellow-200 w-full text-center">
            <button
              type="button"
              onClick={() => router.push('/analysis')}
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full shadow text-base"
              aria-label="Continue to full analysis"
            >
              Continue to Full Analysis →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
