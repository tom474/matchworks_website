import SavedJobCard from "./SavedJobCard"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof SavedJobCard> = {
    title: "homepage/SavedJobCard",
    component: SavedJobCard,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<SavedJobCard />",
            },
        },
    },
}