import RegisterBasicFromField from "./RegisterBasicFromField"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof RegisterBasicFromField> = {
    title: "register/RegisterBasicFromField",
    component: RegisterBasicFromField,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<RegisterBasicFromField />",
            },
        },
    },
}