import ResumeDialog from "./ResumeDialog"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ResumeDialog> = {
    title: "resume-builder/ResumeDialog",
    component: ResumeDialog,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ResumeDialog />",
            },
        },
    },
}