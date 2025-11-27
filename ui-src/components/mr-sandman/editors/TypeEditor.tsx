import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Slider } from "../../ui/slider";
import { ScrollArea } from "../../ui/scroll-area";

export function TypeEditor() {
	const [baseSize, setBaseSize] = useState(16);
	const [scaleRatio, setScaleRatio] = useState(1.25); // Major Third
	const [baseFont, setBaseFont] = useState("Inter");

	// Generate scale
	const steps = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];
	const baseIndex = steps.indexOf("base");

	const calculateSize = (index: number) => {
		const power = index - baseIndex;
		return (baseSize * Math.pow(scaleRatio, power)).toFixed(2);
	};

	return (
		<div className="space-y-6 h-full flex flex-col">
			<div className="flex flex-col space-y-2">
				<h2 className="text-2xl font-bold tracking-tight">Typography System</h2>
				<p className="text-muted-foreground">Define font families, type scales, and text styles.</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Configuration</CardTitle>
						<CardDescription>Set base values for your type system.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Base Font Family</Label>
							<div className="flex gap-2">
								<Input
									value={baseFont}
									onChange={(e) => setBaseFont(e.target.value)}
									placeholder="Inter, sans-serif"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between">
								<Label>Base Size (px)</Label>
								<span className="text-sm text-muted-foreground">{baseSize}px</span>
							</div>
							<Slider
								min={12}
								max={24}
								step={1}
								value={[baseSize]}
								onValueChange={(vals) => setBaseSize(vals[0])}
							/>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between">
								<Label>Scale Ratio</Label>
								<span className="text-sm text-muted-foreground">{scaleRatio}</span>
							</div>
							<Select
								value={scaleRatio.toString()}
								onValueChange={(val) => setScaleRatio(parseFloat(val))}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select ratio" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1.067">1.067 - Minor Second</SelectItem>
									<SelectItem value="1.125">1.125 - Major Second</SelectItem>
									<SelectItem value="1.200">1.200 - Minor Third</SelectItem>
									<SelectItem value="1.250">1.250 - Major Third</SelectItem>
									<SelectItem value="1.333">1.333 - Perfect Fourth</SelectItem>
									<SelectItem value="1.414">1.414 - Augmented Fourth</SelectItem>
									<SelectItem value="1.500">1.500 - Perfect Fifth</SelectItem>
									<SelectItem value="1.618">1.618 - Golden Ratio</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<Card className="flex flex-col h-full">
					<CardHeader>
						<CardTitle>Scale Preview</CardTitle>
						<CardDescription>
							Visualizing {baseFont} at {baseSize}px / {scaleRatio} scale.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-1 p-0">
						<ScrollArea className="h-[400px] px-6 pb-6">
							<div className="space-y-6 pt-4">
								{steps.map((step, i) => {
									const size = calculateSize(i);
									return (
										<div
											key={step}
											className="flex items-baseline gap-4 border-b pb-4 last:border-0"
										>
											<div className="w-16 shrink-0 text-right text-sm text-muted-foreground">
												<div className="font-medium text-foreground">{step}</div>
												<div>{size}px</div>
											</div>
											<div
												style={{
													fontSize: `${size}px`,
													fontFamily: baseFont,
													lineHeight: 1.2,
												}}
												className="truncate font-medium"
											>
												The quick brown fox
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
