import HistoryItem from "./HistoryItem"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof HistoryItem> = {
    title: "roadmap/HistoryItem",
    component: HistoryItem,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<HistoryItem />",
            },
        },
    },
}