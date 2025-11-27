/**
 * Messaging Utilities for Widget <-> UI Communication
 *
 * This module provides a type-safe bridge for communication between
 * the Figma widget and the React UI iframe.
 */

// Define the tab types (should match widget-src/types)
export type WorkbenchTab = "colors" | "typography" | "sizing" | "settings";

// Message types for communication
export type MessageType = "INIT" | "SYNC_STATE" | "UPDATE_TAB" | "CLOSE";

// Message payload structure
export interface MessagePayload {
	activeTab?: WorkbenchTab;
	// Extend with more state fields as needed
	// colors?: ColorPrimitive[];
	// typography?: TypeSettings;
	// sizing?: SizingSettings;
}

// Full message structure
export interface WidgetMessage {
	type: MessageType;
	payload?: MessagePayload;
}

/**
 * Send a message to the Figma widget
 * @param message - The message to send
 */
export function sendToWidget(message: WidgetMessage): void {
	parent.postMessage({ pluginMessage: message }, "*");
}

/**
 * Send a tab change to the widget
 * @param tab - The new active tab
 */
export function updateTab(tab: WorkbenchTab): void {
	sendToWidget({
		type: "UPDATE_TAB",
		payload: { activeTab: tab },
	});
}

/**
 * Request to close the UI
 */
export function closeUI(): void {
	sendToWidget({ type: "CLOSE" });
}

/**
 * Subscribe to messages from the widget
 * @param callback - Handler function for incoming messages
 * @returns Cleanup function to remove the listener
 */
export function subscribeToWidget(callback: (message: WidgetMessage) => void): () => void {
	const handler = (event: MessageEvent) => {
		// Ensure the message is from Figma
		if (event.data?.pluginMessage) {
			callback(event.data.pluginMessage as WidgetMessage);
		}
	};

	window.addEventListener("message", handler);

	return () => {
		window.removeEventListener("message", handler);
	};
}

/**
 * React hook for subscribing to widget messages
 * Usage:
 *   useWidgetMessages((msg) => {
 *     if (msg.type === 'INIT') { ... }
 *   });
 */
export function createMessageHandler(
	onInit?: (payload: MessagePayload) => void,
	onSyncState?: (payload: MessagePayload) => void
): (message: WidgetMessage) => void {
	return (message: WidgetMessage) => {
		switch (message.type) {
			case "INIT":
				if (onInit && message.payload) {
					onInit(message.payload);
				}
				break;
			case "SYNC_STATE":
				if (onSyncState && message.payload) {
					onSyncState(message.payload);
				}
				break;
			default:
				console.log("Unknown message type:", message.type);
		}
	};
}
