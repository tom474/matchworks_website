import SkillsModal from "./SkillsModal"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof SkillsModal> = {
    title: "homepage/SkillsModal",
    component: SkillsModal,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<SkillsModal />",
            },
        },
    },
}