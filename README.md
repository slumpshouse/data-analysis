
**Data Analysis — Agentic Data Quality Analysis Platform**

Purpose
- **Purpose:** Provide an accessible, AI-assisted platform that helps analysts and business users quickly evaluate and improve dataset quality prior to analysis.

Problem
- Many datasets contain missing values, inconsistent schemas, outliers, and drift that make analysis slow and unreliable.
- Manual checks are time-consuming and error-prone; analysts spend excessive time cleaning data instead of extracting insights.
- Non-technical users lack tools to validate datasets before using them in reports or models.

Value
- Automatically detect missing values, anomalies, duplicates and schema problems.
- Produce an overall data quality score and plain-language explanations with recommended fixes.
- Support quick uploads of CSV/JSON/XLSX files and provide interactive visualizations of issues.

Quick start (development)

Prerequisites
- Node.js v18+ and Git
- `pnpm` (recommended) or `npm`
- An OpenAI API key for AI-powered explanations (optional for non-AI features)

Install and run

```bash
# install dependencies (pnpm recommended)
pnpm install

# create .env.local with your OpenAI key and settings (example below)
cat > .env.local <<EOF
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_MAX_FILE_SIZE_MB=50
NEXT_PUBLIC_SUPPORTED_FORMATS=csv,json,xlsx
EOF

# run the dev server
pnpm dev
```

Open `http://localhost:3000` in your browser.

License: MIT — educational use encouraged.
