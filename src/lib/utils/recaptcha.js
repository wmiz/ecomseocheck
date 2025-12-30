/**
 * Client-side utility for Google reCAPTCHA v3
 * 
 * This utility handles executing reCAPTCHA and getting tokens.
 * Make sure to set PUBLIC_RECAPTCHA_SITE_KEY in your environment variables.
 */

/**
 * Initialize reCAPTCHA by loading the script
 * @param {string} siteKey - Your reCAPTCHA site key
 * @returns {Promise<void>}
 */
export async function initRecaptcha(siteKey) {
  // Check if already loaded
  if (window.grecaptcha && window.grecaptcha.ready) {
    return;
  }

  return new Promise((resolve, reject) => {
    // Check if script is already in the DOM
    if (document.querySelector(`script[src*="recaptcha"]`)) {
      // Script exists, wait for it to load
      if (window.grecaptcha && window.grecaptcha.ready) {
        resolve();
      } else {
        window.grecaptcha?.ready(() => resolve());
      }
      return;
    }

    // Create and load the script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.grecaptcha.ready(() => {
        resolve();
      });
    };
    script.onerror = () => {
      reject(new Error("Failed to load reCAPTCHA script"));
    };
    document.head.appendChild(script);
  });
}

/**
 * Execute reCAPTCHA and get a token
 * @param {string} siteKey - Your reCAPTCHA site key
 * @param {string} action - The action name (e.g., 'contact', 'submit')
 * @returns {Promise<string>} The reCAPTCHA token
 */
export async function executeRecaptcha(siteKey, action = "submit") {
  try {
    // Ensure reCAPTCHA is initialized
    await initRecaptcha(siteKey);

    // Execute reCAPTCHA
    const token = await window.grecaptcha.execute(siteKey, { action });
    return token;
  } catch (error) {
    console.error("reCAPTCHA execution error:", error);
    throw new Error("Failed to execute reCAPTCHA. Please try again.");
  }
}


