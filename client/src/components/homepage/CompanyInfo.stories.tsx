import CompanyInfo from "./CompanyInfo"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof CompanyInfo> = {
    title: "homepage/CompanyInfo",
    component: CompanyInfo,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<CompanyInfo />",
            },
        },
    },
}