"use client"
import { useEffect, useState } from "react";

export default function CSRExamplePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/2")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>CSR Example Page</h1>
      <p>This page is rendered on the client. Data is fetched after the page loads.</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre style={{ background: '#f4f4f4', padding: 16, borderRadius: 8 }}>{JSON.stringify(data, null, 2)}</pre>
      )}
    </main>
  );
}
