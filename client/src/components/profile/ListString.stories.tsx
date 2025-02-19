import ListString from "./ListString"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ListString> = {
    title: "profile/ListString",
    component: ListString,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ListString />",
            },
        },
    },
}