import AnalysisScore from "./AnalysisScore"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof AnalysisScore> = {
    title: "resume-builder/AnalysisScore",
    component: AnalysisScore,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<AnalysisScore />",
            },
        },
    },
}