import RoadmapHistory from "./RoadmapHistory"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof RoadmapHistory> = {
    title: "roadmap/RoadmapHistory",
    component: RoadmapHistory,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<RoadmapHistory />",
            },
        },
    },
}