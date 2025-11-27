/**
 * Reusable UI Components (entry)
 */

const { widget } = figma;
const { AutoLayout, Text } = widget;

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
	return (
		<AutoLayout direction="vertical" spacing={4} padding={16} width="fill-parent">
			<Text fontSize={18} fontWeight={700}>
				{title}
			</Text>
			{subtitle && (
				<Text fontSize={14} fill="#666666">
					{subtitle}
				</Text>
			)}
		</AutoLayout>
	);
}

export function Button({
	label,
	onClick,
	variant = "primary",
}: {
	label: string;
	onClick: () => void;
	variant?: "primary" | "secondary";
}) {
	const isPrimary = variant === "primary";

	return (
		<AutoLayout
			padding={{ horizontal: 16, vertical: 12 }}
			cornerRadius={8}
			fill={isPrimary ? "#0066FF" : "#F0F0F0"}
			onClick={onClick}
			hoverStyle={{ opacity: 0.8 }}
		>
			<Text fill={isPrimary ? "#FFFFFF" : "#333333"} fontSize={14}>
				{label}
			</Text>
		</AutoLayout>
	);
}

export function Tabs({
	activeTab,
	onTabChange,
	tabs,
}: {
	activeTab: string;
	onTabChange: (tabId: string) => void;
	tabs: { id: string; label: string }[];
}) {
	return (
		<AutoLayout
			direction="horizontal"
			spacing={0}
			width="fill-parent"
			stroke="#E6E6E6"
			strokeWidth={1}
			cornerRadius={8}
			fill="#F5F5F5"
		>
			{tabs.map((tab) => (
				<AutoLayout
					key={tab.id}
					padding={{ horizontal: 16, vertical: 12 }}
					fill={activeTab === tab.id ? "#FFFFFF" : undefined}
					onClick={() => onTabChange(tab.id)}
					width="fill-parent"
					horizontalAlignItems="center"
					stroke={activeTab === tab.id ? "#E6E6E6" : undefined}
					// Note: strokeWidth as object (per-side) might not be supported in current typings
					strokeWidth={activeTab === tab.id ? 1 : 0}
				>
					<Text
						fontSize={14}
						fontWeight={activeTab === tab.id ? 600 : 400}
						fill={activeTab === tab.id ? "#333333" : "#666666"}
					>
						{tab.label}
					</Text>
				</AutoLayout>
			))}
		</AutoLayout>
	);
}
