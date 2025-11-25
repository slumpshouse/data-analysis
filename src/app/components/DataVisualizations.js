import React from "react";

// Dummy data for demonstration (replace with real data as needed)
const qualityMetrics = [
  { label: "Comp", value: 95 },
  { label: "Cons", value: 90 },
  { label: "Acc", value: 85 },
  { label: "Val", value: 80 },
];

export default function DataVisualizations() {
  return (
    <section
      style={{
        border: "2px dashed #222",
        borderRadius: 16,
        padding: 20,
        margin: 24,
        background: "#fff",
        fontFamily: "monospace",
        position: "relative",
        boxSizing: "border-box",
        maxWidth: 600,
        color: "#000", // Make all text black
      }}
    >
      <div style={{ fontWeight: "normal", fontSize: 16, marginBottom: 0 }}>Data Visualizations:</div>
      <div
        style={{
          borderBottom: "2px dashed #222",
          margin: "4px 0 18px 0",
        }}
      ></div>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start", justifyContent: "center" }}>
        {/* Bar Chart */}
        <div style={{ textAlign: "center", minWidth: 90 }}>
          <div style={{ fontSize: 13, marginBottom: 2 }}>Bar Chart:</div>
          <div style={{ fontSize: 13, marginBottom: 2 }}>Quality Metrics</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, margin: "8px 0 0 0" }}>
            {qualityMetrics.map((m) => (
              <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 4, height: 18 }}>
                <div style={{ width: 6, height: 16, background: "#222", marginRight: 6, borderRadius: 2 }}></div>
                <div style={{ width: 32, textAlign: "right", fontSize: 13 }}>{m.value}%</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, fontSize: 13, letterSpacing: 1 }}>
            {qualityMetrics.map((m) => (
              <div key={m.label} style={{ width: 24, textAlign: "center" }}>{m.label}</div>
            ))}
          </div>
        </div>
        {/* Pie Chart */}
        <div style={{ textAlign: "center", minWidth: 90 }}>
          <div style={{ fontSize: 13, marginBottom: 2 }}>Pie Chart:</div>
          <div style={{ fontSize: 13, marginBottom: 2 }}>Data Types</div>
          <svg width="40" height="40" viewBox="0 0 32 32" style={{ margin: "8px 0 0 0" }}>
            <circle r="16" cx="16" cy="16" fill="#fff" stroke="#222" strokeWidth="1.5" />
            <path d="M16 16 L16 0 A16 16 0 0 1 31.2 21.6 Z" fill="#222" />
            <path d="M16 16 L31.2 21.6 A16 16 0 1 1 16 0 Z" fill="#bbb" />
          </svg>
          <div style={{ fontSize: 12, marginTop: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ color: "#222" }}>Text</span>
            <span style={{ color: "#bbb" }}>Int</span>
          </div>
        </div>
        {/* Column Issues */}
        <div style={{ textAlign: "center", minWidth: 120 }}>
          <div style={{ fontSize: 13, marginBottom: 2 }}>Column Issues:</div>
          <pre style={{
            fontFamily: "monospace",
            fontSize: 13,
            background: "#fff",
            border: "none",
            margin: 0,
            padding: 0,
            textAlign: "left",
            lineHeight: 1.3,
            color: "#000", // Make pre text black
          }}>{`
┌─────────────┐
│ Name:  2    │
│ Age:   6    │
│ Email: 0    │
│ ID:    0    │
│ City:  0    │
└─────────────┘`}</pre>
        </div>
      </div>
    </section>
  );
}
