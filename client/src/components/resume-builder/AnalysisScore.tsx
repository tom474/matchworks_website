import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartConfig = {
    score: {
        label: "Score",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

interface AnalysisScoreProps {
    score: number
}

export default function AnalysisScore({ score }: AnalysisScoreProps) {
    const scorePercentage = score
    const chartData = [
        {
            browser: "safari",
            score: scorePercentage,
            fill: "var(--color-safari)",
        },
    ]
    const endAngle = (scorePercentage / 100) * 360

    return (
        <ChartContainer
            config={chartConfig}
            className="aspect-square cursor-pointer"
        >
            <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={endAngle}
                innerRadius={80}
                outerRadius={110}
            >
                <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 74]}
                />
                <RadialBar dataKey="score" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-4xl font-bold"
                                        >
                                            {Math.round(
                                                chartData[0].score
                                            ).toLocaleString()}
                                            /100
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Overall Score
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </PolarRadiusAxis>
            </RadialBarChart>
        </ChartContainer>
    )
}
