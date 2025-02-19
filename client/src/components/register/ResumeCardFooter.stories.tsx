import ResumeCardFooter from "./ResumeCardFooter"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ResumeCardFooter> = {
    title: "register/ResumeCardFooter",
    component: ResumeCardFooter,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ResumeCardFooter />",
            },
        },
    },
}