'use client';

export default function AnalysisPage() {
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
              <a href="/" className="hover:text-teal-500">[ Home ]</a>
              <a href="#" className="hover:text-teal-500">[ About ]</a>
              <a href="/details" className="hover:text-teal-500">[ Docs ]</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-[600px] mx-auto p-6">
        
        {/* Quality Score and Metrics */}
        <div className="grid grid-cols-[140px_1fr] gap-4 mb-6">
          {/* Big Score Box */}
          <div className="bg-orange-400 rounded-2xl shadow-lg flex items-center justify-center">
            <span className="text-white text-6xl font-bold">85</span>
          </div>

          {/* Quality Metrics */}
          <div className="bg-blue-100 rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Quality Metrics:</h3>
            
            <div className="space-y-2">
              {/* Completeness */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700">Completeness:</span>
                  <span className="text-gray-700">98%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-gray-800 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">• 7 missing values across 2 columns</p>
              </div>

              {/* Consistency */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700">Consistency:</span>
                  <span className="text-gray-700">90%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-gray-800 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">• 1 format variations in 'Email' field</p>
              </div>

              {/* Accuracy */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700">Accuracy:</span>
                  <span className="text-gray-700">88%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-gray-800 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">• 1 outlier detected in 'Age'</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Visualizations */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Data Visualizations:</h3>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Bar Chart */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Bar Chart:</p>
              <p className="text-xs text-gray-600 mb-2">Quality Metrics</p>
              <div className="flex items-end justify-around h-32 border-b border-l border-gray-300 pb-1 pl-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 bg-gray-800" style={{ height: '98%' }}></div>
                  <span className="text-xs">98%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 bg-gray-800" style={{ height: '90%' }}></div>
                  <span className="text-xs">90%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 bg-gray-800" style={{ height: '88%' }}></div>
                  <span className="text-xs">88%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 bg-gray-800" style={{ height: '80%' }}></div>
                  <span className="text-xs">80%</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 text-center mt-2">Comp Cons Acc Val</p>
            </div>

            {/* Pie Chart */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Pie Chart:</p>
              <p className="text-xs text-gray-600 mb-2">Data Types</p>
              <div className="flex items-center justify-center h-32">
                <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ background: 'conic-gradient(#1f2937 0% 60%, #d1d5db 60% 100%)' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full w-12 h-12"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-800"></div>
                  <span>Text</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-300"></div>
                  <span>Int</span>
                </div>
              </div>
            </div>

            {/* Column Issues */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Column Issues:</p>
              <div className="border border-gray-300 rounded p-2 h-32 overflow-y-auto text-xs">
                <ul className="space-y-1">
                  <li>• Name: 2</li>
                  <li>• Age: 6</li>
                  <li>• Email: 0</li>
                  <li>• ID: 0</li>
                  <li>• City: 0</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Insights */}
        <div className="bg-[#f5e6d3] rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-400 pb-2">🤖 AI-Powered Insights:</h3>
          
          <div className="space-y-4">
            <div>
              <p className="font-bold text-gray-800 mb-2">Key Recommendations:</p>
              
              <div className="space-y-3 text-sm text-gray-800">
                <div>
                  <p className="font-semibold">1. Address Missing Values (Priority: High)</p>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• 2 missing values in 'Name' column (2% of data)</li>
                    <li>• 5 missing values in 'Age' column (5% of data)</li>
                    <li>• Suggestion: Consider imputation or removal</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">2. Standardize Email Format (Priority: Medium)</p>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Some emails use uppercase, others lowercase</li>
                    <li>• SQL: UPDATE table SET email = LOWER(email)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
