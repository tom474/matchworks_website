import BasicFormDialog from "./BasicFormDialog"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof BasicFormDialog> = {
    title: "profile/BasicFormDialog",
    component: BasicFormDialog,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<BasicFormDialog />",
            },
        },
    },
}