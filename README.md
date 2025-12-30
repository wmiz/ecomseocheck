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
