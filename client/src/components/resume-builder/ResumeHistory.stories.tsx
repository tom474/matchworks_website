import ResumeHistory from "./ResumeHistory"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ResumeHistory> = {
    title: "resume-builder/ResumeHistory",
    component: ResumeHistory,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ResumeHistory />",
            },
        },
    },
}