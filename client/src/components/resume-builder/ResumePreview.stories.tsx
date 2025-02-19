import ResumePreview from "./ResumePreview"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ResumePreview> = {
    title: "resume-builder/ResumePreview",
    component: ResumePreview,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ResumePreview />",
            },
        },
    },
}