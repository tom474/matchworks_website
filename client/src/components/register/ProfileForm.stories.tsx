import ProfileForm from "./ProfileForm"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ProfileForm> = {
    title: "register/ProfileForm",
    component: ProfileForm,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ProfileForm />",
            },
        },
    },
}