# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Google reCAPTCHA Setup

This project uses Google reCAPTCHA v3 to protect forms from spam and abuse. Follow these steps to set it up:

### 1. Get Your reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to create a new site
3. Choose **reCAPTCHA v3**
4. Add your domain(s) (e.g., `localhost` for development, your production domain)
5. Accept the terms and submit
6. You'll receive two keys:
   - **Site Key** (public) - used on the client side
   - **Secret Key** (private) - used on the server side

### 2. Set Environment Variables

Add the following environment variables to your `.env` file (or your hosting platform's environment variable settings):

```bash
# Public reCAPTCHA Site Key (safe to expose in client-side code)
PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here

# Private reCAPTCHA Secret Key (keep this secret!)
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Important Notes:**

- The `PUBLIC_` prefix makes the variable available in client-side code in SvelteKit
- Never commit your secret key to version control
- Use different keys for development and production environments

### 3. How It Works

- **Client-side**: When a user submits a form, the reCAPTCHA script automatically generates a token
- **Server-side**: The token is verified with Google's servers before processing the form submission
- **Score-based**: reCAPTCHA v3 provides a score (0.0 to 1.0) indicating how likely the interaction is legitimate
  - Scores above 0.5 are typically considered legitimate
  - The current threshold is set to 0.5, but you can adjust it in the server files

### 4. Forms Protected

The following forms are protected with reCAPTCHA:

- Contact form (`/contact`)
- Success form (`/success`)

### 5. Testing

- In development, you can test with `localhost` (make sure to add it to your reCAPTCHA site settings)
- reCAPTCHA v3 runs invisibly in the background - users won't see a checkbox
- If verification fails, users will see an error message asking them to try again

### Troubleshooting

- **"reCAPTCHA verification failed"**: Check that your keys are correct and your domain is registered in reCAPTCHA
- **Script not loading**: Verify `PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
- **Server verification errors**: Check that `RECAPTCHA_SECRET_KEY` is set and correct

## Supabase Database Setup

This project uses Supabase (free tier) to store audit request data. Follow these steps to set it up:

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose an organization (or create one)
4. Fill in:
   - **Name**: Your project name (e.g., "esc-audits")
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes ~2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll need two values:
   - **Project URL** (under "Project URL")
   - **Service Role Key** (under "Project API keys" → "service_role" key)
     - ⚠️ **Important**: This is a secret key - never expose it in client-side code!

### 3. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the `supabase-schema.sql` file in this project
4. Copy and paste the entire contents into the SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This creates:

- `audit_requests` table to store audit data
- Indexes for efficient queries
- Automatic timestamp updates

### 4. Set Environment Variables

Add the following to your `.env` file:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important Notes:**

- Never commit your `.env` file to version control
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - keep it secret!
- Use the **service_role** key, not the anon key (for server-side operations)

### 5. Verify It's Working

1. Run your development server: `npm run dev`
2. Submit an audit request through the form
3. Check your Supabase dashboard:
   - Go to **Table Editor** → `audit_requests`
   - You should see a new row with the audit data

### What Gets Stored

Each audit request saves:

- Store URL and name
- Overall score (0-100) and grade
- Total issues and products audited
- IP address and user agent (for analytics)
- reCAPTCHA score (if available)
- Timestamps (created_at, updated_at)

### Troubleshooting

- **"Missing Supabase environment variables"**: Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in your `.env`
- **"Failed to save audit to Supabase"**: Check the server logs and verify your credentials are correct
- **Table not found**: Make sure you ran the SQL schema file in Supabase SQL Editor
- **Permission errors**: Verify you're using the `service_role` key, not the `anon` key
