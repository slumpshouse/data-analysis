"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Papa from "papaparse";

const FileContext = createContext(null);

export function FileProvider({ children }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsed, setParsed] = useState({ columns: [], rows: [], stats: [] });

  // initialize from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("uploadedFile");
      const parsedRaw = sessionStorage.getItem("uploadedParsed");
      if (parsedRaw) {
        setParsed(JSON.parse(parsedRaw));
      } else if (raw) {
        const parsedObj = JSON.parse(raw);
        setUploadedFile(parsedObj);
      }
    } catch (err) {
      console.error("FileProvider init error", err);
    }
  }, []);

  useEffect(() => {
    try {
      if (uploadedFile) sessionStorage.setItem("uploadedFile", JSON.stringify(uploadedFile));
      else sessionStorage.removeItem("uploadedFile");
    } catch (err) {
      console.error("FileProvider persist uploadedFile error", err);
    }
  }, [uploadedFile]);

  useEffect(() => {
    try {
      if (parsed && parsed.rows && parsed.columns) sessionStorage.setItem("uploadedParsed", JSON.stringify(parsed));
      else sessionStorage.removeItem("uploadedParsed");
    } catch (err) {
      console.error("FileProvider persist parsed error", err);
    }
  }, [parsed]);

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
    return statsOut;
  }

  async function parseXlsxFile(file) {
    try {
      const XLSX = await import("xlsx");
      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab, { type: "array" });
      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { defval: null });
      const cols = Object.keys(data[0] || {});
      const stats = computeStats(data, cols);
      return { columns: cols, rows: data, stats };
    } catch (err) {
      console.error("XLSX parse error", err);
      return null;
    }
  }

  function parseTextFileByName(name, text) {
    try {
      if (name.toLowerCase().endsWith(".csv")) {
        const res = Papa.parse(text, { header: true, skipEmptyLines: true });
        const data = res.data || [];
        const cols = res.meta.fields || Object.keys(data[0] || {});
        const stats = computeStats(data, cols);
        return { columns: cols, rows: data, stats };
      }

      if (name.toLowerCase().endsWith(".json")) {
        const obj = JSON.parse(text);
        const data = Array.isArray(obj) ? obj : [obj];
        const cols = Object.keys(data[0] || {});
        const stats = computeStats(data, cols);
        return { columns: cols, rows: data, stats };
      }

      // fallback: single field
      const rows = [{ content: text.slice(0, 200) }];
      const cols = ["content"];
      const stats = computeStats(rows, cols);
      return { columns: cols, rows, stats };
    } catch (err) {
      console.error("parseTextFileByName error", err);
      return null;
    }
  }

  async function uploadAndParse(file) {
    if (!file) return null;
    try {
      // Prefer sending to external API if NEXT_PUBLIC_API_URL is set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (apiUrl) {
        try {
          const text = await file.text();
          const resp = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: file.name, text }),
          });
          if (resp.ok) {
            const json = await resp.json();
            // expect { columns, rows, stats }
            setUploadedFile({ name: file.name, type: file.type, text });
            setParsed({ columns: json.columns || [], rows: json.rows || [], stats: json.stats || [] });
            return { columns: json.columns || [], rows: json.rows || [], stats: json.stats || [] };
          }
        } catch (err) {
          console.warn("external API parse failed, falling back to client parse", err);
        }
      }

      if (file.name.toLowerCase().endsWith(".xlsx")) {
        const parsedRes = await parseXlsxFile(file);
        if (parsedRes) {
          setUploadedFile({ name: file.name, type: file.type });
          setParsed(parsedRes);
          return parsedRes;
        }
      }

      // for csv/json and fallback, read as text
      const text = await file.text();
      const parsedRes = parseTextFileByName(file.name, text);
      if (parsedRes) {
        setUploadedFile({ name: file.name, type: file.type, text });
        setParsed(parsedRes);
        return parsedRes;
      }
    } catch (err) {
      console.error("uploadAndParse error", err);
    }
    return null;
  }

  const value = { uploadedFile, parsed, setUploadedFile, setParsed, uploadAndParse };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFile() {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error("useFile must be used within FileProvider");
  return ctx;
}

export default FileProvider;
