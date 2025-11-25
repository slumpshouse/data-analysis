export async function generateInsights(analysis) {
  // Call the Next.js API route instead of OpenAI directly
  const response = await fetch('/api/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysis }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'OpenAI API request failed');
  }
  const data = await response.json();
  return data.insights || [];
}
