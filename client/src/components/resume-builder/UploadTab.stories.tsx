import UploadTab from "./UploadTab"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof UploadTab> = {
    title: "resume-builder/UploadTab",
    component: UploadTab,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<UploadTab />",
            },
        },
    },
}