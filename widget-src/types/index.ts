/**
 * Type Definitions
 *
 * Centralized TypeScript types for the mrSandman widget.
 */

/**
 * Widget configuration state
 */
export interface WidgetConfig {
	theme: "light" | "dark";
	mode: "default" | "compact";
	showHeader: boolean;
	autoSave: boolean;
}

/**
 * User data structure
 */
export interface UserData {
	sessionId: string;
	displayName?: string;
	photoUrl?: string;
	lastActive: number;
}

/**
 * Example feature-specific types
 */
export interface ExampleItem {
	id: string;
	title: string;
	description: string;
	createdAt: number;
	createdBy: string;
}

/**
 * Vote data structure
 */
export interface Vote {
	value: "yes" | "no" | "maybe";
	timestamp: number;
}

/**
 * Component props types
 */
export interface HeaderProps {
	title: string;
	subtitle?: string;
}

export interface ButtonProps {
	label: string;
	onClick: () => void;
	variant?: "primary" | "secondary";
	disabled?: boolean;
}

/**
 * State management types
 */
export type SyncedStateKey = "config" | "theme" | "mode";
export type SyncedMapKey = "votes" | "userData" | "items";

/**
 * Error types
 */
export interface AppError {
	code: string;
	message: string;
	timestamp: number;
}

/**
 * API response types (if using network requests)
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
}

// Add more types as needed
