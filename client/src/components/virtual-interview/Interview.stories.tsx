import Interview from "./Interview"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Interview> = {
    title: "virtual-interview/Interview",
    component: Interview,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<Interview />",
            },
        },
    },
}