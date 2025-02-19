import SidebarRoadmap from "./SidebarRoadmap"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof SidebarRoadmap> = {
    title: "roadmap/SidebarRoadmap",
    component: SidebarRoadmap,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<SidebarRoadmap />",
            },
        },
    },
}