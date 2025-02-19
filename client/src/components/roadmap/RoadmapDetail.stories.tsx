import RoadmapDetail from "./RoadmapDetail"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof RoadmapDetail> = {
    title: "roadmap/RoadmapDetail",
    component: RoadmapDetail,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<RoadmapDetail />",
            },
        },
    },
}