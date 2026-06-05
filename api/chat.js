module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:'claude-sonnet-4-6',
        max_tokens: 400,
        system: `You are the Grassgodz support assistant. Always attempt to fully troubleshoot the issue first. Walk through all relevant steps before escalating. Only suggest contacting the team after giving at least 3-4 specific troubleshooting steps. Never escalate on the first or second message. Grassgodz is a lawn care marketplace in DC, MD, VA. Customer issues: login problems (forgot password link, check spam, contact team if stuck), card not working (check billing zip, try different card, call bank to authorize, we accept Visa Mastercard Amex Discover), duplicate accounts (email contact@grassgodz.com with name and phone). Provider issues: Stripe onboarding (name must match ID exactly, use voided check for bank info, full 9-digit SSN, business website is https://grassgodz.com), can't see jobs (log out, clear cache, log back in). Escalate to contact@grassgodz.com only after exhausting troubleshooting steps.`,
        messages: messages
      })
    });

    const data = await response.json();
    const reply = data.content && data.content[0] ? data.content[0].text : null;

    if (!reply) {
      return res.status(500).json({ error: 'Empty response' });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
