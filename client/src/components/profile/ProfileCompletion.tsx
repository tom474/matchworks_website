import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Education, Experience } from "@/model/User"

const basicFields = [
    "name",
    "email",
    "phone",
    "avatar",
    "background",
    "positions",
    "skills",
    "education",
    "experience",
    "interests",
]

function calculateValidPercentage(data: {
    [key: string]: string | string[] | Education[] | Experience[]
}) {
    const totalKeys = basicFields.length
    let validKeys = 0

    for (const key in data) {
        if (!basicFields.includes(key)) {
            continue
        }
        if (data[key] !== "" && data[key].length !== 0) {
            validKeys += 1
        }
    }

    const percentage = (validKeys / totalKeys) * 100
    return percentage
}

const chartConfig = {
    completion: {
        label: "Completion",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

// eslint-disable-next-line
export default function ProfileCompletion(data: any) {
    const completionPercentage = calculateValidPercentage(data.data)
    const chartData = [
        {
            browser: "safari",
            completion: completionPercentage,
            fill: "var(--color-safari)",
        },
    ]
    const endAngle = (completionPercentage / 100) * 360

    return (
        <ChartContainer
            config={chartConfig}
            className="aspect-square h-full full"
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
                <RadialBar dataKey="completion" background cornerRadius={10} />
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
                                                chartData[0].completion
                                            ).toLocaleString()}
                                            %
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Completion
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
