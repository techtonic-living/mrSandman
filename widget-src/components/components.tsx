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
