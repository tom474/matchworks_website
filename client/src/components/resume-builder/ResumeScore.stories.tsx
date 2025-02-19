import ResumeScore from "./ResumeScore"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ResumeScore> = {
    title: "resume-builder/ResumeScore",
    component: ResumeScore,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ResumeScore />",
            },
        },
    },
}