"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFile } from './FileProvider';

export default function Home() {
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      try {
        const res = await uploadAndParse(file);
        if (res) router.push('/preview');
        else console.warn('Upload failed or file could not be parsed');
      } catch (err) {
        console.error('file drop parse error', err);
      }
    }
  };

  const fileInputRef = useRef(null);

  const { uploadAndParse } = useFile();

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const res = await uploadAndParse(file);
        if (res) router.push('/preview');
        else console.warn('Upload failed or file could not be parsed');
      } catch (err) {
        console.error('file input parse error', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex flex-col items-center py-10">
      {/* Navigation Bar */}
      <nav className="bg-yellow-100/80 shadow-md rounded-2xl px-8 py-4 mb-8 border-2 border-yellow-200/60 w-full max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-pink-500 font-extrabold text-xl drop-shadow">[ Logo ]</span>
          <span className="text-gray-800 font-bold tracking-wide text-lg">Data Quality Analysis</span>
        </div>
        <div className="flex gap-6 text-gray-700 font-semibold">
          <a href="#" className="hover:text-pink-500 transition">[ Home ]</a>
          <a href="#" className="hover:text-pink-500 transition">[ About ]</a>
          <a href="/details" className="hover:text-pink-500 transition">[ Docs ]</a>
        </div>
      </nav>

      {/* Main Container */}
      <div className="w-full max-w-2xl mx-auto p-6 bg-white/80 rounded-3xl shadow-xl border-2 border-yellow-100/60">
        {/* Page Header */}
        <div className="bg-white/90 rounded-2xl p-8 mb-6 shadow-xl border-4 border-yellow-200/60 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-pink-600 mb-2 drop-shadow">Upload Your Dataset</h1>
          <p className="text-pink-500 font-semibold">Instant AI-Powered Quality Analysis</p>
        </div>

        {/* File Upload Area */}
        <div 
          className={`bg-white/90 rounded-2xl p-8 mb-6 shadow-xl border-4 border-yellow-200/60 flex flex-col items-center transition-colors ${
            dragActive ? 'border-pink-400 bg-pink-50' : 'border-yellow-200'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-14 w-14 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-pink-500 font-semibold mb-2">Drag & Drop File Here</p>
            <p className="text-gray-500 mb-4">or</p>
            <input
              id="file-input"
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv,.json,.xlsx"
              onChange={handleFileInput}
            />
            <span
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              className="inline-block bg-white border-2 border-pink-400 text-pink-600 px-6 py-2 rounded-full hover:bg-pink-50 transition-colors font-semibold cursor-pointer shadow"
            >
              [ Choose File ]
            </span>
            <p className="text-gray-500 text-sm mt-4">
              Supported formats: CSV, JSON, XLSX (50MB)
            </p>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 rounded-2xl p-8 shadow-xl border-4 border-yellow-200/60 flex flex-col items-center">
          <h3 className="font-extrabold text-pink-600 mb-4 border-b-2 border-yellow-300 pb-2 text-lg tracking-wide drop-shadow-sm w-full text-center">Recent Analyses</h3>
          <div className="space-y-3 w-full">
            {/* Analysis Item 1 */}
            <div className="flex items-start gap-3 bg-white/80 rounded-xl px-4 py-3 border border-yellow-100 shadow w-full">
              <span className="text-pink-400 text-xl">📊</span>
              <div>
                <p className="font-semibold text-gray-800">sales_data.csv - Score: 85 (Good)</p>
                <p className="text-xs text-gray-600">Analyzed: 2 hours ago</p>
              </div>
            </div>
            {/* Analysis Item 2 */}
            <div className="flex items-start gap-3 bg-white/80 rounded-xl px-4 py-3 border border-yellow-100 shadow w-full">
              <span className="text-pink-400 text-xl">📊</span>
              <div>
                <p className="font-semibold text-gray-800">users.json - Score: 92 (Good)</p>
                <p className="text-xs text-gray-600">Analyzed: 1 day ago</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-yellow-200 w-full text-center">
            <p className="font-bold text-gray-800 mb-2">Quick Tip:</p>
            <p className="text-sm text-gray-700">• Ensure column headers are in first row</p>
          </div>
        </div>
      </div>
    </div>
  );
}
