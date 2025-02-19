import Qualification from "./Qualification"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Qualification> = {
    title: "homepage/Qualification",
    component: Qualification,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<Qualification />",
            },
        },
    },
}