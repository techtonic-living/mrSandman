import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import { ScrollArea } from "../../ui/scroll-area";
import { Switch } from "../../ui/switch";

export function SpacingEditor() {
	const [baseUnit, setBaseUnit] = useState(4);
	const [useRem, setUseRem] = useState(true);

	// Simple linear scale for MVP
	const steps = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64];

	return (
		<div className="space-y-6 h-full flex flex-col">
			<div className="flex flex-col space-y-2">
				<h2 className="text-2xl font-bold tracking-tight">Sizing & Spacing</h2>
				<p className="text-muted-foreground">
					Define spacing scales, dimensions, and structural primitives.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-12 h-full">
				<div className="md:col-span-4 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Configuration</CardTitle>
							<CardDescription>Base unit settings.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div className="flex justify-between">
									<Label>Base Unit (px)</Label>
									<span className="text-sm text-muted-foreground">{baseUnit}px</span>
								</div>
								<Slider
									min={2}
									max={10}
									step={1}
									value={[baseUnit]}
									onValueChange={(vals) => setBaseUnit(vals[0])}
								/>
								<p className="text-xs text-muted-foreground">
									Usually 4px or 8px. All spacing tokens will be multiples of this unit.
								</p>
							</div>

							<div className="flex items-center space-x-2 justify-between">
								<Label htmlFor="rem-mode">Display as REM</Label>
								<Switch id="rem-mode" checked={useRem} onCheckedChange={setUseRem} />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Primitives</CardTitle>
							<CardDescription>Core structural values.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label>Corner Radius (Base)</Label>
								<Input type="number" defaultValue={4} />
							</div>
							<div className="space-y-2">
								<Label>Stroke Width (Base)</Label>
								<Input type="number" defaultValue={1} />
							</div>
						</CardContent>
					</Card>
				</div>

				<Card className="md:col-span-8 flex flex-col">
					<CardHeader>
						<CardTitle>Scale Visualization</CardTitle>
						<CardDescription>Previewing {baseUnit}px grid system.</CardDescription>
					</CardHeader>
					<CardContent className="flex-1 p-0 overflow-hidden">
						<ScrollArea className="h-[500px] p-6">
							<div className="space-y-4">
								{steps.map((multiplier) => {
									const pxValue = multiplier * baseUnit;
									const remValue = (pxValue / 16).toFixed(3);
									const displayValue = useRem ? `${remValue}rem` : `${pxValue}px`;

									return (
										<div key={multiplier} className="flex items-center gap-4">
											<div className="w-24 shrink-0 text-sm">
												<span className="font-mono font-medium text-foreground block">
													space-{multiplier}
												</span>
												<span className="text-muted-foreground text-xs">{displayValue}</span>
											</div>
											<div className="flex-1 flex items-center">
												<div
													className="bg-primary/20 border border-primary/50 rounded-sm h-8 relative"
													style={{ width: `${pxValue}px` }}
												>
													<div className="absolute inset-0 flex items-center justify-center text-[10px] text-primary opacity-0 hover:opacity-100 transition-opacity">
														{pxValue}px
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
