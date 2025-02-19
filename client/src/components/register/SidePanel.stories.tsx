import SidePanel from "./SidePanel"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof SidePanel> = {
    title: "register/SidePanel",
    component: SidePanel,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<SidePanel />",
            },
        },
    },
}