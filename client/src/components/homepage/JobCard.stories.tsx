import JobCard from "./JobCard"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof JobCard> = {
    title: "homepage/JobCard",
    component: JobCard,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<JobCard />",
            },
        },
    },
}