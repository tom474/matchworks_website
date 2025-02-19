import NewRoadmap from "./NewRoadmap"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof NewRoadmap> = {
    title: "roadmap/NewRoadmap",
    component: NewRoadmap,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<NewRoadmap />",
            },
        },
    },
}