import ResumeCardHeader from "./ResumeCardHeader"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ResumeCardHeader> = {
    title: "register/ResumeCardHeader",
    component: ResumeCardHeader,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ResumeCardHeader />",
            },
        },
    },
}