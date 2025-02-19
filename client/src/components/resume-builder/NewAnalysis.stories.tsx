import NewAnalysis from "./NewAnalysis"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof NewAnalysis> = {
    title: "resume-builder/NewAnalysis",
    component: NewAnalysis,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<NewAnalysis />",
            },
        },
    },
}