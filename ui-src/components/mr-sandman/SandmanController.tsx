import React, { useState, useEffect } from "react";
import { Workbench } from "../Workbench";
import { ColorEditor } from "./editors/ColorEditor";
import { TypeEditor } from "./editors/TypeEditor";
import { SpacingEditor } from "./editors/SpacingEditor";
import { SettingsEditor } from "./editors/SettingsEditor";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import {
	subscribeToWidget,
	updateTab,
	closeUI,
	createMessageHandler,
	type WorkbenchTab,
} from "../../lib/messaging";

export type ToolType = "Layout" | "Typography" | "Colors" | "Settings" | null;

// Map widget tabs to UI tool types
const tabToTool: Record<WorkbenchTab, ToolType> = {
	colors: "Colors",
	typography: "Typography",
	sizing: "Layout",
	settings: "Settings",
};

const toolToTab: Record<NonNullable<ToolType>, WorkbenchTab> = {
	Colors: "colors",
	Typography: "typography",
	Layout: "sizing",
	Settings: "settings",
};

export function SandmanController() {
	const [activeTool, setActiveTool] = useState<ToolType>(null);

	// Subscribe to messages from the widget
	useEffect(() => {
		const messageHandler = createMessageHandler(
			// onInit - when UI first opens
			(payload) => {
				if (payload.activeTab) {
					setActiveTool(tabToTool[payload.activeTab]);
				}
			},
			// onSyncState - when widget state changes
			(payload) => {
				if (payload.activeTab) {
					setActiveTool(tabToTool[payload.activeTab]);
				}
			}
		);

		const unsubscribe = subscribeToWidget(messageHandler);
		return unsubscribe;
	}, []);

	const handleToolClick = (tool: string) => {
		// Map the string from Workbench to our ToolType
		if (activeTool === tool) {
			setActiveTool(null); // Toggle off
		} else {
			const newTool = tool as ToolType;
			setActiveTool(newTool);

			// Sync with widget
			if (newTool && toolToTab[newTool]) {
				updateTab(toolToTab[newTool]);
			}
		}
	};

	const handleClose = () => {
		closeUI();
	};

	const renderEditor = () => {
		switch (activeTool) {
			case "Colors":
				return <ColorEditor />;
			case "Typography":
				return <TypeEditor />;
			case "Layout":
				return <SpacingEditor />;
			case "Settings":
				return <SettingsEditor />;
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto gap-8 p-4">
			{/* Close button for the entire UI */}
			<Button
				variant="outline"
				size="sm"
				className="absolute top-4 right-4 z-50"
				onClick={handleClose}
			>
				<X className="h-4 w-4 mr-2" />
				Close
			</Button>

			{/* Left Side: The Workbench (Visual Controller) */}
			<div className="flex-none w-full lg:w-[450px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm p-8 relative overflow-hidden">
				<div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

				<div className="text-center mb-8">
					<h2 className="text-lg font-semibold text-slate-700">Tools</h2>
					<p className="text-sm text-slate-500">Select a tool to open the editor</p>
				</div>

				<div className="scale-110">
					<Workbench onToolSelect={handleToolClick} />
				</div>
			</div>

			{/* Right Side: The Editor Panel */}
			<div
				className={cn(
					"flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-500 ease-in-out",
					activeTool
						? "opacity-100 translate-y-0"
						: "opacity-50 translate-y-4 pointer-events-none grayscale"
				)}
			>
				{activeTool ? (
					<div className="h-full flex flex-col">
						<div className="flex items-center justify-between p-4 border-b bg-slate-50/50">
							<div className="flex items-center gap-2">
								<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
									Editor
								</span>
								<span className="h-4 w-px bg-slate-200" />
								<span className="text-sm font-medium text-slate-700">{activeTool}</span>
							</div>
							<Button variant="ghost" size="icon" onClick={() => setActiveTool(null)}>
								<X className="h-4 w-4" />
							</Button>
						</div>
						<div className="flex-1 p-6 overflow-hidden">{renderEditor()}</div>
					</div>
				) : (
					<div className="h-full flex items-center justify-center text-slate-300 flex-col gap-4">
						<div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
							<div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
						</div>
						<p>Select a tool to begin editing</p>
					</div>
				)}
			</div>
		</div>
	);
}
