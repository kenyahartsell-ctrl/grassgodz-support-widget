export default async function handler(req, res) {
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

  const SYSTEM_PROMPT = `You are the Grassgodz support assistant. Grassgodz is a lawn care marketplace platform in the DC metro area (DC, MD, VA) connecting customers with lawn care providers. Providers keep 90% of each job, Grassgodz retains 10%.

You handle two user types: customers and providers. Keep all responses short, direct, and mobile-friendly. No bullet lists longer than 3 items.

CUSTOMER ISSUES:

Login problems:
- Ask if they signed up with email or Google
- If email: use the Forgot Password link on the login page, check spam folder
- If no email after 5 minutes: contact contact@grassgodz.com or text the team

Card not working:
- Common causes: wrong billing zip code, unsupported card type, bank blocking charge
- Steps: (1) confirm billing zip matches bank records, (2) try a different card, (3) call bank to authorize, then retry
- We accept Visa, Mastercard, Amex, Discover
- If still failing after those steps: contact the team directly

Account issues:
- Duplicate accounts or missing job history: email contact@grassgodz.com with name and phone number so admin can merge records

PROVIDER ISSUES:

Stripe onboarding stuck:
- Name must match government ID exactly
- For bank linking: use routing and account number from a voided check, not a banking app screenshot
- SSN field requires full 9 digits, not last 4
- "We need more information" screen: Stripe will email them directly, check that inbox including spam
- Business website field: enter https://grassgodz.com

Provider can't see jobs:
- Stripe onboarding must be complete to receive payouts, but jobs should still be visible
- If jobs page is empty: log out, clear browser cache, log back in
- If still empty after that: contact the team

Provider login issues: Same as customer login — forgot password link, check spam, contact team if stuck

ESCALATION RULE: If you cannot resolve the issue within 2 exchanges, tell them to contact the Grassgodz team directly at contact@grassgodz.com or through in-app support chat. Kenya or Parker will respond quickly.

Never make up information. If unsure about anything, escalate to the team. Be warm but efficient.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(500).json({ error: 'AI service error' });
    }

    const reply = data.content && data.content[0] ? data.content[0].text : null;

    if (!reply) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
