# Grassgodz Support Widget — Deploy Guide

## What this does
A floating chat button that appears on every page of your Grassgodz app. Customers and providers can click it to get instant AI-powered help for login issues, card problems, and Stripe onboarding without waiting for you or Parker.

---

## Step 1 — Upload to GitHub

1. Go to github.com and create a new repository called `grassgodz-support-widget`
2. Upload all files from this folder keeping the same folder structure:
   ```
   grassgodz-support-widget/
   ├── api/
   │   └── chat.js
   ├── public/
   │   └── grassgodz-support.js
   ├── vercel.json
   ├── package.json
   └── README.md
   ```

---

## Step 2 — Deploy to Vercel

1. Go to vercel.com and log in (use the same account as your webhook project)
2. Click **Add New Project**
3. Import your `grassgodz-support-widget` GitHub repo
4. On the configuration screen, leave everything as default
5. Before clicking Deploy, go to **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (same one used in your other projects)
6. Click **Deploy**
7. When done, copy your deployment URL — it will look like: `https://grassgodz-support-widget.vercel.app`

---

## Step 3 — Update the widget URL

Open `public/grassgodz-support.js` and find this line near the top:

```js
var API_URL = 'https://YOUR-VERCEL-APP.vercel.app/api/chat';
```

Replace `YOUR-VERCEL-APP` with your actual Vercel app name. Example:

```js
var API_URL = 'https://grassgodz-support-widget.vercel.app/api/chat';
```

Commit and push that change. Vercel will auto-redeploy.

---

## Step 4 — Embed in Base44

In your Base44 app, go to **Settings → Custom Code → Head HTML** (or Custom HTML section).

Paste this one line:

```html
<script src="https://grassgodz-support-widget.vercel.app/grassgodz-support.js" async></script>
```

Replace the URL with your actual Vercel URL. Save and publish.

The green chat button will now appear on every page of your app — both the customer portal and provider portal.

---

## Testing

After deploying, open your Grassgodz app and look for the green chat button in the bottom-right corner. Click it and test these scenarios:

- Type "I can't log in" — should get login help
- Type "my card isn't working" — should get card troubleshooting steps
- Type "Stripe is asking for more info" — should get Stripe onboarding guidance
- Type "I need to talk to a person" — should escalate to contact@grassgodz.com

---

## Updating the bot's knowledge

If you add new features or change policies, open `api/chat.js` and update the `SYSTEM_PROMPT` text. Push to GitHub and Vercel redeploys automatically.

---

## Questions

Contact: contact@grassgodz.com
