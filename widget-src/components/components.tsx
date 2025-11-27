/**
 * Reusable UI Components for mrSandman Widget
 *
 * Design tokens from Figma:
 * - Border: #e0c19c (golden/tan)
 * - Button background: rgba(49, 74, 97, 1) (#314a61 dark blue-gray)
 * - Button size: 80x80 with 7px border
 * - Logo size: 180x180
 */

const { widget } = figma;
const { AutoLayout, Text, SVG } = widget;

// Design tokens from Figma mockup
const TOKENS = {
	borderColor: "#e0c19c",
	buttonBg: "#314a61",
	buttonBgHover: "#3d5a75",
	buttonSize: 80,
	buttonBorder: 7,
	iconSize: 48,
	logoSize: 180,
} as const;

// SVG icons extracted from Figma design
const ICONS = {
	colors: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="24" cy="12" r="8" fill="#e0c19c"/>
		<circle cx="12" cy="28" r="8" fill="#e0c19c"/>
		<circle cx="36" cy="28" r="8" fill="#e0c19c"/>
		<circle cx="24" cy="36" r="6" fill="#e0c19c"/>
	</svg>`,
	typography: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M12 12H36V16H26V36H22V16H12V12Z" fill="#e0c19c"/>
	</svg>`,
	spacing: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="8" y="8" width="14" height="14" rx="2" fill="#e0c19c"/>
		<rect x="26" y="8" width="14" height="14" rx="2" fill="#e0c19c"/>
		<rect x="8" y="26" width="14" height="14" rx="2" fill="#e0c19c"/>
		<rect x="26" y="26" width="14" height="14" rx="2" fill="#e0c19c"/>
	</svg>`,
	settings: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" clip-rule="evenodd" d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30ZM24 27C25.6569 27 27 25.6569 27 24C27 22.3431 25.6569 21 24 21C22.3431 21 21 22.3431 21 24C21 25.6569 22.3431 27 24 27Z" fill="#e0c19c"/>
		<path d="M20 8L21.5 12H26.5L28 8H20Z" fill="#e0c19c"/>
		<path d="M20 40L21.5 36H26.5L28 40H20Z" fill="#e0c19c"/>
		<path d="M8 20L12 21.5V26.5L8 28V20Z" fill="#e0c19c"/>
		<path d="M40 20L36 21.5V26.5L40 28V20Z" fill="#e0c19c"/>
		<path d="M11.5 11.5L14.5 15L17 12.5L14 9.5L11.5 11.5Z" fill="#e0c19c"/>
		<path d="M36.5 36.5L33.5 33L31 35.5L34 38.5L36.5 36.5Z" fill="#e0c19c"/>
		<path d="M11.5 36.5L14.5 33L17 35.5L14 38.5L11.5 36.5Z" fill="#e0c19c"/>
		<path d="M36.5 11.5L33.5 15L31 12.5L34 9.5L36.5 11.5Z" fill="#e0c19c"/>
	</svg>`,
};

export type ToolType = "colors" | "typography" | "spacing" | "settings";

interface ToolButtonProps {
	tool: ToolType;
	isActive?: boolean;
	onClick: () => void;
}

/**
 * Circular tool button with icon
 * Matches Figma design: 80x80, 7px golden border, dark blue-gray fill
 */
export function ToolButton({ tool, isActive = false, onClick }: ToolButtonProps) {
	return (
		<AutoLayout
			width={TOKENS.buttonSize}
			height={TOKENS.buttonSize}
			cornerRadius={999}
			fill={TOKENS.buttonBg}
			stroke={TOKENS.borderColor}
			strokeWidth={TOKENS.buttonBorder}
			horizontalAlignItems="center"
			verticalAlignItems="center"
			onClick={onClick}
			hoverStyle={{
				fill: TOKENS.buttonBgHover,
			}}
			effect={
				isActive
					? {
							type: "drop-shadow",
							color: { r: 0.88, g: 0.76, b: 0.61, a: 0.5 },
							offset: { x: 0, y: 0 },
							blur: 12,
						}
					: undefined
			}
		>
			<SVG src={ICONS[tool]} width={TOKENS.iconSize} height={TOKENS.iconSize} />
		</AutoLayout>
	);
}

// Legacy components for backwards compatibility

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

export { TOKENS, ICONS };
