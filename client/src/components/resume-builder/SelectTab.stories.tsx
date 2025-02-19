import SelectTab from "./SelectTab"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof SelectTab> = {
    title: "resume-builder/SelectTab",
    component: SelectTab,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<SelectTab />",
            },
        },
    },
}