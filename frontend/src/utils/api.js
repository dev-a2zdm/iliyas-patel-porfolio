/**
 * API Client for Portfolio Frontend
 * Supports configurable VITE_API_BASE_URL environment variable.
 * Defaults to http://localhost:5000 in development, or relative path in production.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

/**
 * Submit contact message to backend API
 * @param {Object} payload - { name, email, phone, subject, message }
 * @returns {Promise<Object>} API response data
 */
export async function submitContactMessage(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.message || `Server responded with status ${response.status}`);
      error.status = response.status;
      error.errors = data?.errors;
      throw error;
    }

    return data;
  } catch (err) {
    // If it's already our structured error, rethrow
    if (err.errors || err.status) {
      throw err;
    }
    // Network or connection failure
    const networkError = new Error(
      'Unable to connect to the server. Please check your internet connection or try again later.'
    );
    networkError.status = 0;
    throw networkError;
  }
}

