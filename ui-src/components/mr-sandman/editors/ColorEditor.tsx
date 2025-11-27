import React, { useState } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { ScrollArea } from "../../ui/scroll-area";

interface ColorPrimitive {
	id: string;
	name: string;
	value: string; // Hex for now
}

export function ColorEditor() {
	const [primitives, setPrimitives] = useState<ColorPrimitive[]>([
		{ id: "1", name: "Primary Blue", value: "#3B82F6" },
		{ id: "2", name: "Alert Red", value: "#EF4444" },
		{ id: "3", name: "Success Green", value: "#10B981" },
	]);

	const [newColorName, setNewColorName] = useState("");
	const [newColorValue, setNewColorValue] = useState("#000000");

	const addPrimitive = () => {
		if (!newColorName) return;
		const newPrimitive: ColorPrimitive = {
			id: Math.random().toString(36).substr(2, 9),
			name: newColorName,
			value: newColorValue,
		};
		setPrimitives([...primitives, newPrimitive]);
		setNewColorName("");
		setNewColorValue("#000000");
	};

	const removePrimitive = (id: string) => {
		setPrimitives(primitives.filter((p) => p.id !== id));
	};

	// Simulated Ramp Generation (visual only for MVP)
	const renderRamp = (baseColor: string) => {
		return (
			<div className="flex h-8 w-full rounded-md overflow-hidden border border-slate-200">
				{[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((opacity, i) => (
					<div
						key={i}
						className="flex-1"
						style={{ backgroundColor: baseColor, opacity: opacity }}
					/>
				))}
			</div>
		);
	};

	return (
		<div className="space-y-6 h-full flex flex-col">
			<div className="flex flex-col space-y-2">
				<h2 className="text-2xl font-bold tracking-tight">Color Management</h2>
				<p className="text-muted-foreground">
					Manage primitives, generate ramps, and map semantic tokens.
				</p>
			</div>

			<Tabs defaultValue="primitives" className="flex-1 flex flex-col">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="primitives">Primitives</TabsTrigger>
					<TabsTrigger value="ramps">Ramps</TabsTrigger>
					<TabsTrigger value="semantic">Semantic</TabsTrigger>
				</TabsList>

				<TabsContent value="primitives" className="flex-1 flex flex-col space-y-4 mt-4">
					<Card>
						<CardHeader>
							<CardTitle>Add Primitive</CardTitle>
							<CardDescription>Define atomic colors (Hex/LCH).</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										placeholder="e.g., Brand Blue"
										value={newColorName}
										onChange={(e) => setNewColorName(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="value">Value</Label>
									<div className="flex gap-2">
										<Input
											id="value"
											type="color"
											className="w-12 p-1 h-10"
											value={newColorValue}
											onChange={(e) => setNewColorValue(e.target.value)}
										/>
										<Input
											value={newColorValue}
											onChange={(e) => setNewColorValue(e.target.value)}
											className="flex-1"
										/>
									</div>
								</div>
							</div>
							<Button onClick={addPrimitive} className="w-full">
								<Plus className="mr-2 h-4 w-4" /> Add Color
							</Button>
						</CardContent>
					</Card>

					<ScrollArea className="flex-1 h-[300px] rounded-md border p-4">
						<div className="space-y-4">
							{primitives.map((primitive) => (
								<div
									key={primitive.id}
									className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
								>
									<div className="flex items-center gap-4">
										<div
											className="w-10 h-10 rounded-full border shadow-sm"
											style={{ backgroundColor: primitive.value }}
										/>
										<div>
											<p className="font-medium text-sm">{primitive.name}</p>
											<p className="text-xs text-muted-foreground uppercase">{primitive.value}</p>
										</div>
									</div>
									<Button variant="ghost" size="icon" onClick={() => removePrimitive(primitive.id)}>
										<Trash2 className="h-4 w-4 text-destructive" />
									</Button>
								</div>
							))}
						</div>
					</ScrollArea>
				</TabsContent>

				<TabsContent value="ramps" className="mt-4">
					<ScrollArea className="h-[450px] pr-4">
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-medium">Generated Scales (Preview)</h3>
								<Button variant="outline" size="sm">
									<RefreshCw className="mr-2 h-3 w-3" /> Regenerate
								</Button>
							</div>
							{primitives.map((primitive) => (
								<div key={primitive.id} className="space-y-2">
									<div className="flex justify-between items-center text-sm">
										<span className="font-medium">{primitive.name}</span>
										<span className="text-xs text-muted-foreground">10 steps</span>
									</div>
									{renderRamp(primitive.value)}
								</div>
							))}
							{primitives.length === 0 && (
								<div className="text-center py-10 text-muted-foreground text-sm">
									No primitives defined. Add primitives to generate ramps.
								</div>
							)}
						</div>
					</ScrollArea>
				</TabsContent>

				<TabsContent value="semantic">
					<div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-sm text-center p-4 border border-dashed rounded-md">
						<p>
							Semantic token mapping (e.g. <code>bg-primary</code> → <code>Blue-500</code>) will be
							available in Phase 2.
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
