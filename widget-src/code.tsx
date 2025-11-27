// This widget will open an Iframe window with buttons to show a toast message and close the window.

const { widget } = figma;
const { useEffect, useSyncedState, AutoLayout, Text } = widget;

import { Header, Tabs } from "./components";
import { WorkbenchTab } from "./types";

function Widget() {
	const [activeTab, setActiveTab] = useSyncedState<WorkbenchTab>("activeTab", "colors");

	useEffect(() => {
		figma.ui.onmessage = (msg) => {
			if (msg.type === "showToast") {
				figma.notify("Hello widget");
			}
			if (msg.type === "close") {
				figma.closePlugin();
			}
		};
	});

	const tabs = [
		{ id: "colors", label: "Colors" },
		{ id: "typography", label: "Typography" },
		{ id: "sizing", label: "Sizing" },
		{ id: "settings", label: "Settings" },
	];

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

			<Tabs
				activeTab={activeTab}
				onTabChange={(id) => setActiveTab(id as WorkbenchTab)}
				tabs={tabs}
			/>

			<AutoLayout
				direction="vertical"
				spacing={16}
				width="fill-parent"
				padding={16}
				fill="#FAFAFA"
				cornerRadius={8}
				height={400}
			>
				{activeTab === "colors" && (
					<Text fontSize={16} fill="#333333">
						Color Management (Coming Soon)
					</Text>
				)}
				{activeTab === "typography" && (
					<Text fontSize={16} fill="#333333">
						Typography System (Coming Soon)
					</Text>
				)}
				{activeTab === "sizing" && (
					<Text fontSize={16} fill="#333333">
						Sizing & Spacing (Coming Soon)
					</Text>
				)}
				{activeTab === "settings" && (
					<Text fontSize={16} fill="#333333">
						Widget Settings (Coming Soon)
					</Text>
				)}
			</AutoLayout>
		</AutoLayout>
	);
}

widget.register(Widget);
