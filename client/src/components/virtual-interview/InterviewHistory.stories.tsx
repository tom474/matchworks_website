import InterviewHistory from "./InterviewHistory"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof InterviewHistory> = {
    title: "virtual-interview/InterviewHistory",
    component: InterviewHistory,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<InterviewHistory />",
            },
        },
    },
}