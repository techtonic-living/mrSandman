// Silence TypeScript complaints about react/jsx-runtime which isn't used in Figma widgets.
declare module "react/jsx-runtime" {
	export const jsx: unknown;
	export const jsxs: unknown;
	export const Fragment: unknown;
}
