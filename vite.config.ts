import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

// Plugin to handle figma:asset imports
const figmaAssetsPlugin = (): Plugin => {
	return {
		name: "figma-assets-plugin",
		enforce: "pre",
		resolveId(id: string) {
			if (id.startsWith("figma:asset/")) {
				return id;
			}
		},
		load(id: string) {
			if (id.startsWith("figma:asset/")) {
				return `export default "${id}";`;
			}
		},
	};
};

export default defineConfig({
	root: "./ui-src",
	plugins: [react(), viteSingleFile(), figmaAssetsPlugin()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./ui-src"),
		},
	},
	build: {
		outDir: "../dist",
		emptyOutDir: false, // Don't delete code.js
		target: "esnext",
		assetsInlineLimit: 100000000, // Inline everything
		chunkSizeWarningLimit: 100000000,
		cssCodeSplit: false,
		reportCompressedSize: false,
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
});
