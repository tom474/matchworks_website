import BasicForm from "./BasicForm"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof BasicForm> = {
    title: "register/BasicForm",
    component: BasicForm,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<BasicForm />",
            },
        },
    },
}