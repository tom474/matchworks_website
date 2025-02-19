import ProfileResume from "./ProfileResume"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ProfileResume> = {
    title: "profile/ProfileResume",
    component: ProfileResume,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ProfileResume />",
            },
        },
    },
}