import ChecklistItem from "./ChecklistItem"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ChecklistItem> = {
    title: "roadmap/ChecklistItem",
    component: ChecklistItem,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ChecklistItem />",
            },
        },
    },
}