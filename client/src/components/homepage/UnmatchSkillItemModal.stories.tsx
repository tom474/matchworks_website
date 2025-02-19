import UnmatchSkillItemModal from "./UnmatchSkillItemModal"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof UnmatchSkillItemModal> = {
    title: "homepage/UnmatchSkillItemModal",
    component: UnmatchSkillItemModal,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<UnmatchSkillItemModal />",
            },
        },
    },
}