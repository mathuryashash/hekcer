const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Send a hack attempt to the backend API
 * @param {string} userInput - The user's prompt injection attempt
 * @param {number} level - Current level (1-5)
 * @param {string} sessionId - Optional session ID
 * @returns {Promise<Object>} API response with message, success, next_level
 */
export async function sendHackAttempt(userInput, level, sessionId = null) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(`${API_BASE}/api/hack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: userInput,
                level: level,
                session_id: sessionId,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 429) {
            return {
                message: '[RATE LIMIT]: Too many requests. Slow down, hacker.',
                success: false,
                next_level: level,
                error: 'rate_limit',
            };
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                message: `[ERROR]: ${errorData.detail || 'Server error. Try again.'}`,
                success: false,
                next_level: level,
                error: 'server_error',
            };
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            return {
                message: '[TIMEOUT]: The AI took too long to respond. Try again.',
                success: false,
                next_level: level,
                error: 'timeout',
            };
        }

        return {
            message: '[CONNECTION ERROR]: Cannot reach the server. Check your connection.',
            success: false,
            next_level: level,
            error: 'network',
        };
    }
}

/**
 * Submit the extracted password to check for a win
 * @param {string} password - The password string
 * @param {number} level - Current level
 * @returns {Promise<Object>} API response
 */
export async function submitPassword(password, level) {
    try {
        const response = await fetch(`${API_BASE}/api/submit_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password, level: level }),
        });

        if (!response.ok) {
            return { success: false, message: "[ERROR]: Server returned " + response.status };
        }

        return await response.json();
    } catch {
        return { success: false, message: "[CONNECTION ERROR]: Cannot reach the server." };
    }
}

/**
 * Check if the backend API is healthy
 * @returns {Promise<boolean>}
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        return data.status === 'healthy';
    } catch {
        return false;
    }
}
