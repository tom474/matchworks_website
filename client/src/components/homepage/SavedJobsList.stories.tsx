import SavedJobsList from "./SavedJobsList"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof SavedJobsList> = {
    title: "homepage/SavedJobsList",
    component: SavedJobsList,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<SavedJobsList />",
            },
        },
    },
}