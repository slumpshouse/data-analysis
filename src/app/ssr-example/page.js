// Server Component (SSR) Example
// No 'use client' directive means this runs on the server

export default async function SSRExamplePage() {
  // Fetch data on the server (SSR)
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', { cache: 'no-store' });
  const data = await res.json();

  return (
    <main style={{ padding: 24 }}>
      <h1>SSR Example Page</h1>
      <p>This page is rendered on the server. Data is fetched at request time.</p>
      <pre style={{ background: '#f4f4f4', padding: 16, borderRadius: 8 }}>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
