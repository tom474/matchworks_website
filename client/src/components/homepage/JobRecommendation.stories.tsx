import JobRecommendation from "./JobRecommendation"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof JobRecommendation> = {
    title: "homepage/JobRecommendation",
    component: JobRecommendation,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<JobRecommendation />",
            },
        },
    },
}