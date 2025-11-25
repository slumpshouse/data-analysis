// src/app/api/insights/route.js

export async function POST(req) {
  try {
    const { analysis } = await req.json();
    if (!analysis) {
      return new Response(JSON.stringify({ error: 'Analysis payload missing' }), { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not set' }), { status: 400 });
    }
    const stats = analysis?.stats || [];
    const sampleRows = (analysis?.rows || []).slice(0, 5);
    const prompt = `You are a data quality analyst. Given the following column stats, metrics, and a sample of the actual data, provide 3-5 actionable, specific insights for improving data quality.\n\nColumn stats: ${JSON.stringify(stats)}\nMetrics: ${JSON.stringify(analysis.metrics || {})}\nSample data: ${JSON.stringify(sampleRows)}\n\nBe specific to the data, and avoid generic advice.`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful data quality analyst.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.4,
      }),
    });
    const text = await response.text();
    if (!response.ok) {
      let reason = 'OpenAI API request failed';
      let errObj = {};
      try {
        errObj = JSON.parse(text);
        reason = errObj?.error?.message || reason;
      } catch {}
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        reason,
        errObj,
        text
      });
      return new Response(JSON.stringify({ insights: [], reason }), { status: 500 });
    }
    let payload;
    try {
      payload = JSON.parse(text);
    } catch (parseErr) {
      return new Response(JSON.stringify({ insights: [], reason: parseErr.message || 'Invalid JSON from OpenAI' }), { status: 500 });
    }
    const aiText = payload.choices?.[0]?.message?.content || '';
    const insights = aiText.split(/\n|\r|\u2022|\-/).map(s => s.trim()).filter(Boolean);
    return new Response(JSON.stringify({ insights }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ insights: [], reason: err.message || 'Unexpected server error' }), { status: 500 });
  }
}
