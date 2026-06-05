module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const messages = body.messages || [];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: 'You are the Grassgodz lawn care support assistant for the DC metro area. Help customers with login issues, card payment problems, and help providers with Stripe onboarding. Be brief and direct. Escalate to contact@grassgodz.com if unresolved after 3 steps.',
        messages: messages.length > 0 ? messages : [{ role: 'user', content: 'hello' }]
      })
    });

    const data = await response.json();
    console.log('Anthropic response status:', response.status);
    console.log('Anthropic data:', JSON.stringify(data).slice(0, 200));

    const reply = data.content && data.content[0] ? data.content[0].text : 'Please email contact@grassgodz.com for help.';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Caught error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
