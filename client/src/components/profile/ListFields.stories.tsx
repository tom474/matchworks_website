import ListFields from "./ListFields"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ListFields> = {
    title: "profile/ListFields",
    component: ListFields,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ListFields />",
            },
        },
    },
}