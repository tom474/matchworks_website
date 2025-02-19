import JobDetailModal from "./JobDetailModal"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof JobDetailModal> = {
    title: "homepage/JobDetailModal",
    component: JobDetailModal,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<JobDetailModal />",
            },
        },
    },
}