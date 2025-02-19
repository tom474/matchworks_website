import TabManager from "./TabManager"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof TabManager> = {
    title: "register/TabManager",
    component: TabManager,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<TabManager />",
            },
        },
    },
}