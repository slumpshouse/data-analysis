"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useFile } from '../FileProvider';

export default function PreviewPage() {
  const router = useRouter();
  const { uploadedFile, parsed } = useFile();
  const [fileInfo, setFileInfo] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // prefer provider-parsed data
    if (parsed && parsed.rows && parsed.columns && parsed.rows.length > 0) {
      setFileInfo({ name: uploadedFile?.name || '(uploaded)' });
      setRows(parsed.rows.slice(0, 100));
      setColumns(parsed.columns || Object.keys(parsed.rows[0] || {}));
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
          setColumns(res.meta.fields || Object.keys(data[0] || {}));
          computeStats(data, res.meta.fields || Object.keys(data[0] || {}));
        } catch (err) {
          console.error('fallback CSV parse error', err);
        }
      } else if (parsedRaw.name && parsedRaw.name.toLowerCase().endsWith(".json")) {
        try {
          const obj = JSON.parse(parsedRaw.text);
          const data = Array.isArray(obj) ? obj : [obj];
          setRows(data.slice(0, 100));
          setColumns(Object.keys(data[0] || {}));
          computeStats(data, Object.keys(data[0] || {}));
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
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Navigation Bar */}
      <nav className="bg-blue-100 shadow-sm">
        <div className="max-w-[600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-teal-500 font-bold text-lg">[ Logo ]</span>
              <span className="text-gray-700 font-medium">Data Quality Analysis</span>
            </div>
            <div className="flex gap-6 text-gray-700">
              <a href="/" className="hover:text-teal-500">[ Home ]</a>
              <a href="#" className="hover:text-teal-500">[ About ]</a>
              <a href="/details" className="hover:text-teal-500">[ Docs ]</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-[600px] mx-auto p-6">
        {/* File Info Header */}
        <div className="bg-blue-100 rounded-lg p-4 mb-6 shadow-sm">
          <p className="text-gray-800 font-medium">File: {fileInfo?.name || "(no file)"}</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <p className="text-gray-700 mb-2">Analyzing...</p>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div className="bg-gray-800 h-6 rounded-full" style={{ width: "75%" }}></div>
          </div>
          <p className="text-gray-600 text-sm mt-1 text-right">75%</p>
        </div>

        {/* Data Preview Table */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Data Preview (First 100 rows):</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  {columns.map((col) => (
                    <th key={col} className="text-left p-2 font-semibold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td className="p-2" colSpan={columns.length}>No data to preview</td>
                  </tr>
                )}
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    {columns.map((col) => (
                      <td key={col} className="p-2">{String(r[col] ?? "").slice(0, 100)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-300">
            <h4 className="font-bold text-gray-800 mb-3">Column Statistics:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {stats.map((s) => (
                <li key={s.col}>• {s.col}: {s.unique} unique, {s.missing} missing</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Initial Quality Overview */}
        <div className="bg-[#f5e6d3] rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Initial Quality Overview:</h3>

          <div className="space-y-2 text-sm text-gray-800">
            <p>Issues detected: {columns.length} columns identified</p>
            <p>Null values found: {stats.reduce((a, b) => a + (b.missing || 0), 0)} total across {stats.filter(s => s.missing>0).length} columns</p>
            <p>Potential issues: {stats.filter(s => s.unique === 0).length} columns with no unique values</p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-400">
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/analysis')}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-md"
                aria-label="Continue to full analysis"
              >
                Continue to Full Analysis →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
