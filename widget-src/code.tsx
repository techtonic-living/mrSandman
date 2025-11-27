/**
 * mrSandman Widget - Design System Foundations Workbench
 *
 * A Figma widget for managing design tokens (colors, typography, sizing).
 * Opens an iframe UI for detailed editing and syncs state via postMessage.
 */

const { widget } = figma;
const { useEffect, useSyncedState, usePropertyMenu, AutoLayout, Text } = widget;

import { Header, Tabs } from "./components";
import { WorkbenchTab } from "./types";

// Message types for Widget <-> UI communication
interface WidgetMessage {
	type: "INIT" | "SYNC_STATE" | "UPDATE_TAB" | "CLOSE";
	payload?: {
		activeTab?: WorkbenchTab;
		// Add more state fields as needed
	};
}

function Widget() {
	const [activeTab, setActiveTab] = useSyncedState<WorkbenchTab>("activeTab", "colors");
	const [isUIOpen, setIsUIOpen] = useSyncedState<boolean>("isUIOpen", false);

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
				setActiveTab("colors");
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
						setActiveTab(msg.payload.activeTab);
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
						activeTab,
					},
				};
				figma.ui.postMessage(initMessage);
			}, 100);
		});
	};

	const tabs = [
		{ id: "colors", label: "Colors" },
		{ id: "typography", label: "Typography" },
		{ id: "sizing", label: "Sizing" },
		{ id: "settings", label: "Settings" },
	];

	// Handle tab change from widget UI
	const handleTabChange = (id: string) => {
		setActiveTab(id as WorkbenchTab);
		// If UI is open, sync the tab change
		if (isUIOpen) {
			const syncMessage: WidgetMessage = {
				type: "SYNC_STATE",
				payload: { activeTab: id as WorkbenchTab },
			};
			figma.ui.postMessage(syncMessage);
		}
	};

	return (
		<AutoLayout
			direction="vertical"
			spacing={16}
			padding={24}
			width={600}
			fill="#FFFFFF"
			cornerRadius={16}
			stroke="#E6E6E6"
			effect={{
				type: "drop-shadow",
				color: { r: 0, g: 0, b: 0, a: 0.1 },
				offset: { x: 0, y: 4 },
				blur: 12,
			}}
		>
			<Header
				title="Sandman Foundations"
				subtitle="Manage your design system tokens directly in Figma."
			/>

			<Tabs activeTab={activeTab} onTabChange={handleTabChange} tabs={tabs} />

			{/* Content area - clicking opens the full editor */}
			<AutoLayout
				direction="vertical"
				spacing={16}
				width="fill-parent"
				padding={16}
				fill="#FAFAFA"
				cornerRadius={8}
				height={400}
				onClick={openUI}
				hoverStyle={{ fill: "#F0F0F0" }}
			>
				<AutoLayout
					direction="vertical"
					spacing={8}
					width="fill-parent"
					height="fill-parent"
					horizontalAlignItems="center"
					verticalAlignItems="center"
				>
					{activeTab === "colors" && (
						<>
							<Text fontSize={20} fill="#333333" fontWeight={600}>
								🎨 Color Management
							</Text>
							<Text fontSize={14} fill="#666666">
								Click to open the editor
							</Text>
						</>
					)}
					{activeTab === "typography" && (
						<>
							<Text fontSize={20} fill="#333333" fontWeight={600}>
								📝 Typography System
							</Text>
							<Text fontSize={14} fill="#666666">
								Click to open the editor
							</Text>
						</>
					)}
					{activeTab === "sizing" && (
						<>
							<Text fontSize={20} fill="#333333" fontWeight={600}>
								📐 Sizing & Spacing
							</Text>
							<Text fontSize={14} fill="#666666">
								Click to open the editor
							</Text>
						</>
					)}
					{activeTab === "settings" && (
						<>
							<Text fontSize={20} fill="#333333" fontWeight={600}>
								⚙️ Widget Settings
							</Text>
							<Text fontSize={14} fill="#666666">
								Click to open the editor
							</Text>
						</>
					)}
				</AutoLayout>
			</AutoLayout>
		</AutoLayout>
	);
}

widget.register(Widget);
