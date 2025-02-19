import JobDetail from "./JobDetail"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof JobDetail> = {
    title: "homepage/JobDetail",
    component: JobDetail,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<JobDetail />",
            },
        },
    },
}