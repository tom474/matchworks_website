import JobSearch from "./JobSearch"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof JobSearch> = {
    title: "homepage/JobSearch",
    component: JobSearch,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<JobSearch />",
            },
        },
    },
}