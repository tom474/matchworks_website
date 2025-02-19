import InputListString from "./InputListString"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof InputListString> = {
    title: "register/InputListString",
    component: InputListString,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<InputListString />",
            },
        },
    },
}