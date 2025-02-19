import NewInterview from "./NewInterview"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof NewInterview> = {
    title: "virtual-interview/NewInterview",
    component: NewInterview,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<NewInterview />",
            },
        },
    },
}