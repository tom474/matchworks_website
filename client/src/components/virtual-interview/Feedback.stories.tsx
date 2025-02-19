import Feedback from "./Feedback"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Feedback> = {
    title: "virtual-interview/Feedback",
    component: Feedback,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<Feedback />",
            },
        },
    },
}