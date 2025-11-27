/**
 * mrSandman Widget - Design System Foundations Workbench
 *
 * A Figma widget for managing design tokens (colors, typography, sizing).
 * Circular tool selector with central logo, matching Figma design.
 */

const { widget } = figma;
const { useEffect, useSyncedState, usePropertyMenu, Frame, Image } = widget;

import { ToolButton, TOKENS } from "./components";
import type { ToolType } from "./components";
import { WorkbenchTab } from "./types";

// Logo asset from Figma (expires in 7 days - should be replaced with permanent asset)
const LOGO_URL = "https://www.figma.com/api/mcp/asset/e9c48430-1a34-403f-b206-9879101fedbf";

// Message types for Widget <-> UI communication
interface WidgetMessage {
	type: "INIT" | "SYNC_STATE" | "UPDATE_TAB" | "CLOSE";
	payload?: {
		activeTab?: WorkbenchTab;
	};
}

// Tool positions relative to center (matching Figma layout)
// Positions are calculated from the 350x300 canvas with tools arranged in arc
const TOOL_POSITIONS: Record<ToolType, { x: number; y: number }> = {
	colors: { x: 151 - 175, y: 110 - 150 }, // top-left area
	typography: { x: 174 - 175, y: 126 - 150 }, // upper right
	spacing: { x: 167 - 175, y: 150 - 150 }, // right side
	settings: { x: 100 - 175, y: 156 - 150 }, // bottom left
};

function Widget() {
	const [activeTool, setActiveTool] = useSyncedState<ToolType>("activeTool", "colors");
	const [_isUIOpen, setIsUIOpen] = useSyncedState<boolean>("isUIOpen", false);

	// Property menu for quick actions
	usePropertyMenu(
		[
			{
				itemType: "action",
				propertyName: "openEditor",
				tooltip: "Open Editor",
			},
			{
				itemType: "separator",
			},
			{
				itemType: "action",
				propertyName: "resetState",
				tooltip: "Reset to Defaults",
			},
		],
		(event) => {
			if (event.propertyName === "openEditor") {
				openUI();
			} else if (event.propertyName === "resetState") {
				setActiveTool("colors");
				figma.notify("Widget state reset to defaults");
			}
		}
	);

	// Handle messages from the UI iframe
	useEffect(() => {
		figma.ui.onmessage = (msg: WidgetMessage) => {
			switch (msg.type) {
				case "UPDATE_TAB":
					if (msg.payload?.activeTab) {
						setActiveTool(msg.payload.activeTab as ToolType);
					}
					break;
				case "CLOSE":
					setIsUIOpen(false);
					figma.closePlugin();
					break;
				default:
					break;
			}
		};
	});

	// Open the UI iframe and send initial state
	const openUI = () => {
		return new Promise<void>(() => {
			figma.showUI(__html__, {
				width: 800,
				height: 600,
				title: "mrSandman Workbench",
			});
			setIsUIOpen(true);

			// Send initial state to UI after a brief delay to ensure UI is ready
			setTimeout(() => {
				const initMessage: WidgetMessage = {
					type: "INIT",
					payload: {
						activeTab: activeTool as WorkbenchTab,
					},
				};
				figma.ui.postMessage(initMessage);
			}, 100);
		});
	};

	// Handle tool button click
	const handleToolClick = (tool: ToolType) => {
		setActiveTool(tool);
		openUI();
	};

	return (
		<Frame width={350} height={300} fill="#F5F5F5">
			{/* Central Logo - clickable to open editor */}
			<Frame
				x={175 - TOKENS.logoSize / 2}
				y={150 - TOKENS.logoSize / 2 + 28}
				width={TOKENS.logoSize}
				height={TOKENS.logoSize}
				cornerRadius={999}
				onClick={openUI}
			>
				<Image src={LOGO_URL} width={TOKENS.logoSize} height={TOKENS.logoSize} cornerRadius={999} />
			</Frame>

			{/* Colors tool button - top left area */}
			<Frame
				x={175 + TOOL_POSITIONS.colors.x - TOKENS.buttonSize / 2}
				y={150 + TOOL_POSITIONS.colors.y - TOKENS.buttonSize / 2}
				width={TOKENS.buttonSize}
				height={TOKENS.buttonSize}
			>
				<ToolButton
					tool="colors"
					isActive={activeTool === "colors"}
					onClick={() => handleToolClick("colors")}
				/>
			</Frame>

			{/* Typography tool button - upper right */}
			<Frame
				x={175 + TOOL_POSITIONS.typography.x - TOKENS.buttonSize / 2}
				y={150 + TOOL_POSITIONS.typography.y - TOKENS.buttonSize / 2}
				width={TOKENS.buttonSize}
				height={TOKENS.buttonSize}
			>
				<ToolButton
					tool="typography"
					isActive={activeTool === "typography"}
					onClick={() => handleToolClick("typography")}
				/>
			</Frame>

			{/* Spacing tool button - right side */}
			<Frame
				x={175 + TOOL_POSITIONS.spacing.x - TOKENS.buttonSize / 2}
				y={150 + TOOL_POSITIONS.spacing.y - TOKENS.buttonSize / 2}
				width={TOKENS.buttonSize}
				height={TOKENS.buttonSize}
			>
				<ToolButton
					tool="spacing"
					isActive={activeTool === "spacing"}
					onClick={() => handleToolClick("spacing")}
				/>
			</Frame>

			{/* Settings tool button - bottom left */}
			<Frame
				x={175 + TOOL_POSITIONS.settings.x - TOKENS.buttonSize / 2}
				y={150 + TOOL_POSITIONS.settings.y - TOKENS.buttonSize / 2}
				width={TOKENS.buttonSize}
				height={TOKENS.buttonSize}
			>
				<ToolButton
					tool="settings"
					isActive={activeTool === "settings"}
					onClick={() => handleToolClick("settings")}
				/>
			</Frame>
		</Frame>
	);
}

widget.register(Widget);
