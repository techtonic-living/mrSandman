/**
 * Utility Functions
 *
 * Helper functions for common operations in the mrSandman widget.
 */

/**
 * Format a number with thousand separators
 * @param num - The number to format
 * @returns Formatted string (e.g., "1,234")
 */
export function formatNumber(num: number): string {
	return num.toLocaleString();
}

/**
 * Truncate text to a maximum length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 3) + "...";
}

/**
 * Get current user's session ID
 * @returns Session ID string
 */
export function getCurrentSessionId(): string {
	return figma.currentUser?.sessionId?.toString() || "unknown";
}

/**
 * Debounce function calls
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: number | undefined;
	return (...args: Parameters<T>) => {
		if (timeout !== undefined) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => func(...args), wait) as unknown as number;
	};
}

/**
 * Safely parse JSON with fallback
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
	try {
		return JSON.parse(json);
	} catch {
		return fallback;
	}
}

/**
 * Generate a unique ID
 * @returns Unique string ID
 */
export function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array)
 * @param value - Value to check
 * @returns True if empty
 */
export function isEmpty(value: unknown): boolean {
	if (value == null) return true;
	if (typeof value === "string") return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === "object") return Object.keys(value as object).length === 0;
	return false;
}

// Add more utility functions as needed
