'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        const payload = { name: file.name, type: file.type, text };
        try {
          sessionStorage.setItem('uploadedFile', JSON.stringify(payload));
        } catch (err) {
          console.error('sessionStorage error', err);
        }
        router.push('/preview');
      };
      reader.readAsText(file);
    }
  };

  const fileInputRef = useRef(null);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        const payload = { name: file.name, type: file.type, text };
        try {
          sessionStorage.setItem('uploadedFile', JSON.stringify(payload));
        } catch (err) {
          console.error('sessionStorage error', err);
        }
        router.push('/preview');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Navigation Bar */}
      <nav className="bg-blue-100 shadow-sm">
        <div className="max-w-[600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-teal-500 font-bold text-lg">[ Logo ]</span>
              <span className="text-gray-700 font-medium">Data Quality Analysis</span>
            </div>
            <div className="flex gap-6 text-gray-700">
              <a href="#" className="hover:text-teal-500">[ Home ]</a>
              <a href="#" className="hover:text-teal-500">[ About ]</a>
              <a href="/details" className="hover:text-teal-500">[ Docs ]</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-[600px] mx-auto p-6">

        {/* Page Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Dataset</h1>
          <p className="text-gray-600">Instant AI-Powered Quality Analysis</p>
        </div>

        {/* File Upload Area */}
        <div 
          className={`bg-white rounded-lg p-8 mb-6 shadow-sm border-4 border-dashed transition-colors ${
            dragActive ? 'border-teal-500 bg-teal-50' : 'border-teal-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <p className="text-teal-500 font-medium mb-2">Drag & Drop File Here</p>
            <p className="text-gray-500 mb-4">or</p>
            
            <label className="cursor-pointer">
              <span
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                className="inline-block bg-white border-2 border-teal-400 text-teal-600 px-6 py-2 rounded-lg hover:bg-teal-50 transition-colors font-medium"
              >
                [ Choose File ]
              </span>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".csv,.json,.xlsx"
                onChange={handleFileInput}
              />
            </label>
            
            <p className="text-gray-500 text-sm mt-4">
              Supported formats: CSV, JSON, XLSX (50MB)
            </p>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-[#f5e6d3] rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">Recent Analyses:</h3>
          
          <div className="space-y-3">
            {/* Analysis Item 1 */}
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-xl">📊</span>
              <div>
                <p className="font-medium text-gray-800">sales_data.csv - Score: 85 (Good)</p>
                <p className="text-sm text-gray-600">Analyzed: 2 hours ago</p>
              </div>
            </div>

            {/* Analysis Item 2 */}
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-xl">📊</span>
              <div>
                <p className="font-medium text-gray-800">users.json - Score: 92 (Good)</p>
                <p className="text-sm text-gray-600">Analyzed: 1 day ago</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-400">
            <p className="font-bold text-gray-800 mb-2">Quick Tip:</p>
            <p className="text-sm text-gray-700">• Ensure column headers are in first row</p>
          </div>
        </div>
      </div>
    </div>
  );
}
