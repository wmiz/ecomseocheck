/**
 * Server-side utility for verifying Google reCAPTCHA v3 tokens
 *
 * This utility verifies reCAPTCHA tokens on the server.
 * Make sure to set RECAPTCHA_SECRET_KEY in your environment variables.
 */

import { env } from "$env/dynamic/private";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/**
 * Verify a reCAPTCHA token
 * @param {string} token - The reCAPTCHA token to verify
 * @param {string} remoteip - Optional: The user's IP address
 * @returns {Promise<{success: boolean, score?: number, action?: string, error?: string}>}
 */
export async function verifyRecaptcha(token, remoteip = null) {
  const secretKey = env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not set in environment variables");
    return {
      success: false,
      error: "reCAPTCHA configuration error",
    };
  }

  if (!token) {
    return {
      success: false,
      error: "reCAPTCHA token is missing",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteip) {
      formData.append("remoteip", remoteip);
    }

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(
        `reCAPTCHA verification request failed: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error:
          data["error-codes"]?.join(", ") || "reCAPTCHA verification failed",
      };
    }

    // For reCAPTCHA v3, also check the score (0.0 to 1.0)
    // Lower scores indicate more suspicious activity
    // Typically, scores above 0.5 are considered legitimate
    const score = data.score || 0;
    const action = data.action;

    return {
      success: true,
      score,
      action,
    };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return {
      success: false,
      error: "Failed to verify reCAPTCHA token",
    };
  }
}

/**
 * Verify reCAPTCHA with a minimum score threshold
 * @param {string} token - The reCAPTCHA token to verify
 * @param {number} minScore - Minimum score threshold (default: 0.5)
 * @param {string} remoteip - Optional: The user's IP address
 * @returns {Promise<{success: boolean, score?: number, error?: string}>}
 */
export async function verifyRecaptchaWithScore(
  token,
  minScore = 0.5,
  remoteip = null
) {
  const result = await verifyRecaptcha(token, remoteip);

  if (!result.success) {
    return result;
  }

  if (result.score < minScore) {
    return {
      success: false,
      score: result.score,
      error: `reCAPTCHA score too low: ${result.score.toFixed(
        2
      )} (minimum: ${minScore})`,
    };
  }

  return result;
}
