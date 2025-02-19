import ProfileCompletion from "./ProfileCompletion"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ProfileCompletion> = {
    title: "profile/ProfileCompletion",
    component: ProfileCompletion,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ProfileCompletion />",
            },
        },
    },
}