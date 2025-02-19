import ProfileFormDialog from "./ProfileFormDialog"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ProfileFormDialog> = {
    title: "profile/ProfileFormDialog",
    component: ProfileFormDialog,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ProfileFormDialog />",
            },
        },
    },
}