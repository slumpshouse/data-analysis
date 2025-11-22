"use client";

import { useState } from "react";

export default function DetailsPage() {
  const [open, setOpen] = useState({ name: true, age: false, email: false, city: false });

  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <nav className="bg-blue-100 shadow-sm">
        <div className="max-w-[600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-teal-500 font-bold text-lg">[ Logo ]</span>
              <span className="text-gray-700 font-medium">Data Quality Analysis</span>
            </div>
            <div className="flex gap-6 text-gray-700">
              <a href="/" className="hover:text-teal-500">[ Home ]</a>
              <a href="/" className="hover:text-teal-500">[ About ]</a>
              <a href="/details" className="hover:text-teal-500">[ Docs ]</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[600px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Detailed Insights</h1>

        {/* Name Card */}
        <div className="mb-4">
          <button
            className="w-full text-left bg-amber-300 hover:bg-amber-400 text-gray-900 rounded-lg p-3 flex justify-between items-center shadow-sm"
            onClick={() => toggle('name')}
            aria-expanded={open.name}
          >
            <span className="font-semibold">Column: Name (Text) - 2 Issues Found</span>
            <span>{open.name ? '▾' : '▸'}</span>
          </button>
          {open.name && (
            <div className="border rounded-b-lg p-4 bg-white">
              <p className="font-medium">Analysis Details:</p>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                <li>Type: Text (String)</li>
                <li>Missing Values: 2 out of 100 (2%)</li>
                <li>Unique Values: 98</li>
                <li>Duplicates: 2</li>
              </ul>
              <p className="mt-3 font-medium">Suggested Fixes:</p>
              <ol className="ml-5 list-decimal text-sm text-gray-700">
                <li>Fill missing values with "Unknown" or remove rows</li>
                <li>Standardize name format (Title Case)</li>
              </ol>
            </div>
          )}
        </div>

        {/* Age Card */}
        <div className="mb-4">
          <button
            className="w-full text-left bg-rose-300 hover:bg-rose-400 text-gray-900 rounded-lg p-3 flex justify-between items-center shadow-sm"
            onClick={() => toggle('age')}
            aria-expanded={open.age}
          >
            <span className="font-semibold">Column: Age (Integer) - 6 Issues Found</span>
            <span>{open.age ? '▾' : '▸'}</span>
          </button>
          {open.age && (
            <div className="border rounded-b-lg p-4 bg-white">
              <p className="font-medium">Analysis Details:</p>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                <li>Type: Integer (Numeric)</li>
                <li>Missing Values: 5 out of 100 (5%)</li>
                <li>Unique Values: 45</li>
                <li>Outliers: 4 (e.g. 150)</li>
              </ul>
              <p className="mt-3 font-medium">Suggested Fixes:</p>
              <ol className="ml-5 list-decimal text-sm text-gray-700">
                <li>Remove or correct outlier values</li>
                <li>Fill missing values with median (32)</li>
              </ol>
            </div>
          )}
        </div>

        {/* Email Card */}
        <div className="mb-4">
          <button
            className="w-full text-left bg-teal-400 hover:bg-teal-500 text-white rounded-lg p-3 flex justify-between items-center shadow-sm"
            onClick={() => toggle('email')}
            aria-expanded={open.email}
          >
            <span className="font-semibold">Column: Email (Text) - No Issues ✓</span>
            <span>{open.email ? '▾' : '▸'}</span>
          </button>
          {open.email && (
            <div className="border rounded-b-lg p-4 bg-white">
              <p className="font-medium">Analysis Details:</p>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                <li>Type: Text</li>
                <li>Missing Values: 0</li>
                <li>Unique Values: 100</li>
              </ul>
            </div>
          )}
        </div>

        {/* City Card */}
        <div className="mb-4">
          <button
            className="w-full text-left bg-teal-400 hover:bg-teal-500 text-white rounded-lg p-3 flex justify-between items-center shadow-sm"
            onClick={() => toggle('city')}
            aria-expanded={open.city}
          >
            <span className="font-semibold">Column: City (Text) - No Issues ✓</span>
            <span>{open.city ? '▾' : '▸'}</span>
          </button>
          {open.city && (
            <div className="border rounded-b-lg p-4 bg-white">
              <p className="font-medium">Analysis Details:</p>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                <li>Type: Text</li>
                <li>Missing Values: 0</li>
                <li>Unique Values: 8</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
