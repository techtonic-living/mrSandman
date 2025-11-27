import svgPaths from "../imports/svg-oeq0dws29m";
import imgLogo2XlPng1 from "figma:asset/e4dd541cb35008a531c8f92eb858f45115e0f2d8.png";
import { imgLogo2XlPng } from "../imports/svg-47lyv";

function MobileLayoutIcon() {
	return (
		<div className="relative shrink-0 size-[48px]" data-name="mobile_layout">
			<svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
				<g filter="url(#filter0_d_1_115)" id="mobile_layout">
					<mask
						className="mask-type-alpha"
						height="48"
						id="mask0_1_115"
						maskUnits="userSpaceOnUse"
						width="48"
						x="0"
						y="0"
					>
						<rect fill="var(--fill-0, #F5EFE1)" height="48" id="Bounding box" width="48" />
					</mask>
					<g mask="url(#mask0_1_115)">
						<path d={svgPaths.p33c1f100} fill="var(--fill-0, #F5EFE1)" id="mobile_layout_2" />
					</g>
				</g>
				<defs>
					<filter
						colorInterpolationFilters="sRGB"
						filterUnits="userSpaceOnUse"
						height="38"
						id="filter0_d_1_115"
						width="46"
						x="2"
						y="6"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset dx="1" dy="1" />
						<feGaussianBlur stdDeviation="0.5" />
						<feComposite in2="hardAlpha" operator="out" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0.741176 0 0 0 0 0.592157 0 0 0 0 0.313726 0 0 0 1 0"
						/>
						<feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_115" />
						<feBlend
							in="SourceGraphic"
							in2="effect1_dropShadow_1_115"
							mode="normal"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>
		</div>
	);
}

function LayoutTool({ onClick }: { onClick?: () => void }) {
	return (
		<div
			onClick={onClick}
			className="absolute box-border content-stretch flex gap-[10px] items-center justify-center left-[calc(50%+119px)] p-[10px] rounded-[999px] size-[80px] top-[calc(50%+62px)] translate-x-[-50%] translate-y-[-50%] cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-[linear-gradient(90deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.2)_100%),linear-gradient(90deg,rgb(49,74,97)_0%,rgb(49,74,97)_100%)]"
			data-name="Spacing"
		>
			<div
				aria-hidden="true"
				className="absolute border-[#e0c19c] border-[7px] border-solid inset-[-7px] pointer-events-none rounded-[1006px]"
			/>
			<MobileLayoutIcon />
		</div>
	);
}

function TypographyIcon() {
	return (
		<div className="absolute left-0 size-[48px] top-0" data-name="brand_family">
			<svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
				<g filter="url(#filter0_d_1_105)" id="brand_family">
					<mask
						className="mask-type-alpha"
						height="48"
						id="mask0_1_105"
						maskUnits="userSpaceOnUse"
						width="48"
						x="0"
						y="0"
					>
						<rect fill="var(--fill-0, #F5EFE1)" height="48" id="Bounding box" width="48" />
					</mask>
					<g mask="url(#mask0_1_105)">
						<path d={svgPaths.p244ef670} fill="var(--fill-0, #F5EFE1)" id="brand_family_2" />
					</g>
				</g>
				<defs>
					<filter
						colorInterpolationFilters="sRGB"
						filterUnits="userSpaceOnUse"
						height="42"
						id="filter0_d_1_105"
						width="41"
						x="4"
						y="4"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset dx="1" dy="1" />
						<feGaussianBlur stdDeviation="0.5" />
						<feComposite in2="hardAlpha" operator="out" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0.741176 0 0 0 0 0.592157 0 0 0 0 0.313726 0 0 0 1 0"
						/>
						<feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_105" />
						<feBlend
							in="SourceGraphic"
							in2="effect1_dropShadow_1_105"
							mode="normal"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>
		</div>
	);
}

function TypographyTool({ onClick }: { onClick?: () => void }) {
	return (
		<div
			onClick={onClick}
			className="absolute box-border content-stretch flex gap-[10px] items-center justify-center left-[calc(50%+109px)] p-[10px] rounded-[999px] size-[80px] top-[calc(50%-17px)] translate-x-[-50%] translate-y-[-50%] cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-[linear-gradient(90deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.2)_100%),linear-gradient(90deg,rgb(49,74,97)_0%,rgb(49,74,97)_100%)]"
			data-name="Typography"
		>
			<div
				aria-hidden="true"
				className="absolute border-[#e0c19c] border-[7px] border-solid inset-[-7px] pointer-events-none rounded-[1006px]"
			/>
			<div className="relative shrink-0 size-[48px]">
				<TypographyIcon />
			</div>
		</div>
	);
}

function PaletteIcon() {
	return (
		<div className="relative shrink-0 size-[48px]" data-name="palette">
			<svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
				<g filter="url(#filter0_d_1_111)" id="palette">
					<mask
						className="mask-type-alpha"
						height="48"
						id="mask0_1_111"
						maskUnits="userSpaceOnUse"
						width="48"
						x="0"
						y="0"
					>
						<rect fill="var(--fill-0, #F5EFE1)" height="48" id="Bounding box" width="48" />
					</mask>
					<g mask="url(#mask0_1_111)">
						<path d={svgPaths.p24055a00} fill="var(--fill-0, #F5EFE1)" id="palette_2" />
					</g>
				</g>
				<defs>
					<filter
						colorInterpolationFilters="sRGB"
						filterUnits="userSpaceOnUse"
						height="42"
						id="filter0_d_1_111"
						width="42"
						x="4"
						y="4"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset dx="1" dy="1" />
						<feGaussianBlur stdDeviation="0.5" />
						<feComposite in2="hardAlpha" operator="out" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0.741176 0 0 0 0 0.592157 0 0 0 0 0.313726 0 0 0 1 0"
						/>
						<feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_111" />
						<feBlend
							in="SourceGraphic"
							in2="effect1_dropShadow_1_111"
							mode="normal"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>
		</div>
	);
}

function ColorsTool({ onClick }: { onClick?: () => void }) {
	return (
		<div
			onClick={onClick}
			className="absolute box-border content-stretch flex gap-[10px] items-center justify-center left-[calc(50%+56px)] p-[10px] rounded-[999px] size-[80px] top-[calc(50%-79px)] translate-x-[-50%] translate-y-[-50%] cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-[linear-gradient(90deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.2)_100%),linear-gradient(90deg,rgb(49,74,97)_0%,rgb(49,74,97)_100%)]"
			data-name="Colors"
		>
			<div
				aria-hidden="true"
				className="absolute border-[#e0c19c] border-[7px] border-solid inset-[-7px] pointer-events-none rounded-[1006px]"
			/>
			<PaletteIcon />
		</div>
	);
}

function SettingsIcon() {
	return (
		<div className="relative shrink-0 size-[48px]" data-name="settings">
			<svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
				<g filter="url(#filter0_d_1_101)" id="settings">
					<mask
						className="mask-type-alpha"
						height="48"
						id="mask0_1_101"
						maskUnits="userSpaceOnUse"
						width="48"
						x="0"
						y="0"
					>
						<rect fill="var(--fill-0, #F5EFE1)" height="48" id="Bounding box" width="48" />
					</mask>
					<g mask="url(#mask0_1_101)">
						<path d={svgPaths.pd429180} fill="var(--fill-0, #F5EFE1)" id="settings_2" />
					</g>
				</g>
				<defs>
					<filter
						colorInterpolationFilters="sRGB"
						filterUnits="userSpaceOnUse"
						height="42"
						id="filter0_d_1_101"
						width="42"
						x="4"
						y="4"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset dx="1" dy="1" />
						<feGaussianBlur stdDeviation="0.5" />
						<feComposite in2="hardAlpha" operator="out" />
						<feColorMatrix
							type="matrix"
							values="0 0 0 0 0.741176 0 0 0 0 0.592157 0 0 0 0 0.313726 0 0 0 1 0"
						/>
						<feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_101" />
						<feBlend
							in="SourceGraphic"
							in2="effect1_dropShadow_1_101"
							mode="normal"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>
		</div>
	);
}
function SettingsTool({ onClick }: { onClick?: () => void }) {
	return (
		<div
			onClick={onClick}
			className="absolute box-border content-stretch flex gap-[10px] items-center justify-center left-[calc(50%-119px)] p-[10px] rounded-[999px] size-[80px] top-[calc(50%+67px)] translate-x-[-50%] translate-y-[-50%] cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-[linear-gradient(90deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.2)_100%),linear-gradient(90deg,rgb(49,74,97)_0%,rgb(49,74,97)_100%)]"
			data-name="Settings"
		>
			<div
				aria-hidden="true"
				className="absolute border-[#e0c19c] border-[7px] border-solid inset-[-7px] pointer-events-none rounded-[1006px]"
			/>
			<SettingsIcon />
		</div>
	);
}

function MainLogo() {
	return (
		<div
			className="absolute left-[calc(50%-1px)] size-[180px] top-[calc(50%+28px)] translate-x-[-50%] translate-y-[-50%]"
			data-name="logo-cir-2xl-png"
		>
			{/* eslint-disable-next-line */}
			<div
				className="absolute aspect-1536/1536 left-[-4.01%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-[7.225px_8.113px] mask-size-[180px_180px] right-[-4.15%] top-[-8.11px]"
				data-name="logo-2xl-png"
				style={{ maskImage: `url('${imgLogo2XlPng}')`, WebkitMaskImage: `url('${imgLogo2XlPng}')` }}
			>
				<img
					alt="Mr Sandman Logo"
					className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
					src={imgLogo2XlPng1}
				/>
			</div>
		</div>
	);
}

export function Workbench({ onToolSelect }: { onToolSelect?: (tool: string) => void }) {
	const handleToolClick = (toolName: string) => {
		console.log(`Tool clicked: ${toolName}`);
		onToolSelect?.(toolName);
	};

	return (
		<div className="relative size-[400px] mx-auto my-10" data-name="Workbench">
			{/*
         The original design was absolute positioned within a "size-full" container.
         I've given it a fixed size container here to make it easier to place in the app,
         but the internal absolute positioning is preserved from the Figma import.
         The container size needs to be large enough to hold the absolute items.
         The furthest item is about 160px out from center (half of 320+), so 400px should be safe.
       */}
			<div className="absolute inset-0">
				<LayoutTool onClick={() => handleToolClick("Layout")} />
				<TypographyTool onClick={() => handleToolClick("Typography")} />
				<ColorsTool onClick={() => handleToolClick("Colors")} />
				<SettingsTool onClick={() => handleToolClick("Settings")} />
				<MainLogo />
			</div>
		</div>
	);
}
