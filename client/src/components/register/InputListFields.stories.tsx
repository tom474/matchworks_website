import InputListFields from "./InputListFields"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof InputListFields> = {
    title: "register/InputListFields",
    component: InputListFields,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<InputListFields />",
            },
        },
    },
}