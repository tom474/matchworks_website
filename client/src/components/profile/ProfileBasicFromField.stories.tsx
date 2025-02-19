import ProfileBasicFromField from "./ProfileBasicFromField"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ProfileBasicFromField> = {
    title: "profile/ProfileBasicFromField",
    component: ProfileBasicFromField,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ProfileBasicFromField />",
            },
        },
    },
}