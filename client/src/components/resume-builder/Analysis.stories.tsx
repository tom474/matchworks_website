import Analysis from "./Analysis"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Analysis> = {
    title: "resume-builder/Analysis",
    component: Analysis,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<Analysis />",
            },
        },
    },
}