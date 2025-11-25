"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Papa from "papaparse";

const FileContext = createContext(null);

export function FileProvider({ children }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsed, setParsed] = useState({ columns: [], rows: [], stats: [] });
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);

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
      if (parsed && parsed.columns) sessionStorage.setItem("uploadedParsed", JSON.stringify(parsed));
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
      const mod = await import("xlsx");
      const XLSX = mod && mod.default ? mod.default : mod;
      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab, { type: "array" });
      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      const data = Array.isArray(XLSX.utils?.sheet_to_json)
        ? XLSX.utils.sheet_to_json(firstSheet, { defval: null })
        : [];
      const cols = data.length > 0 ? Object.keys(data[0]) : [];
      const stats = computeStats(data, cols);
      return { columns: cols, rows: data, stats };
    } catch (err) {
      console.error("XLSX parse error", err);
      return { columns: [], rows: [], stats: [] };
    }
  }

  function parseTextFileByName(name, text) {
    try {
      if (name.toLowerCase().endsWith(".csv")) {
        // First attempt: treat first row as header
        const res = Papa.parse(text, { header: true, skipEmptyLines: true });
        let data = res.data || [];
        let cols = res.meta.fields || [];
        // If header parse produced no columns, fallback to raw rows without header
        if (!cols || cols.length === 0) {
          const raw = Papa.parse(text, { header: false, skipEmptyLines: true });
          const rawRows = raw.data || [];
          if (rawRows.length > 0) {
            const headerGuessLength = rawRows[0].length;
            cols = Array.from({ length: headerGuessLength }, (_, i) => `column_${i + 1}`);
            // Map each subsequent row array to object using generated column names
            data = rawRows.map((arr) => {
              const obj = {};
              cols.forEach((c, idx) => { obj[c] = arr[idx]; });
              return obj;
            });
          } else {
            cols = [];
            data = [];
          }
        } else {
          // Clean column names (trim whitespace)
          cols = cols.map((c) => (typeof c === 'string' ? c.trim() : c));
        }
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
      console.log('[FileProvider] uploadAndParse start', file.name, file.type, file.size);
      setParsing(true);
      setProgress(5);
      // Prefer sending to external API if NEXT_PUBLIC_API_URL is set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (apiUrl) {
        try {
          const text = await file.text();
          setProgress(25);
          const resp = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: file.name, text }),
          });
            if (resp.ok) {
            const json = await resp.json();
            // expect { columns, rows, stats }
            setUploadedFile({ name: file.name, type: file.type, text });
            const parsedJson = { columns: json.columns || [], rows: json.rows || [], stats: json.stats || [] };
            setParsed(parsedJson);
            setProgress(100);
            setParsing(false);
              console.log('[FileProvider] parsed via API', parsedJson.columns?.length, parsedJson.rows?.length);
            return parsedJson;
          }
        } catch (err) {
          console.warn("external API parse failed, falling back to client parse", err);
        }
      }
      // try XLSX first
      if (file.name.toLowerCase().endsWith(".xlsx")) {
        setProgress(35);
        const parsedRes = await parseXlsxFile(file);
        if (parsedRes) {
          setUploadedFile({ name: file.name, type: file.type });
          setParsed(parsedRes);
          setProgress(100);
          setParsing(false);
          console.log('[FileProvider] parsed xlsx', parsedRes.columns?.length, parsedRes.rows?.length);
          return parsedRes;
        } else {
          console.warn('[FileProvider] parseXlsxFile returned null');
        }
      }

      // for csv/json and fallback, read as text
      setProgress(40);
      const text = await file.text();
      setProgress(60);
      const parsedRes = parseTextFileByName(file.name, text);
      if (parsedRes) {
        setUploadedFile({ name: file.name, type: file.type, text });
        setParsed(parsedRes);
        setProgress(100);
        setParsing(false);
        console.log('[FileProvider] parsed text', parsedRes.columns?.length, parsedRes.rows?.length);
        return parsedRes;
      } else {
        console.warn('[FileProvider] parseTextFileByName returned null');
      }
    } catch (err) {
      console.error("uploadAndParse error", err);
    }
    setParsing(false);
    setProgress(0);
    return null;
  }

  const value = { uploadedFile, parsed, setUploadedFile, setParsed, uploadAndParse, parsing, progress };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFile() {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error("useFile must be used within FileProvider");
  return ctx;
}

export default FileProvider;
