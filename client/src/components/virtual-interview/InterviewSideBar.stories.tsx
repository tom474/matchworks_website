import InterviewSideBar from "./InterviewSideBar"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof InterviewSideBar> = {
    title: "virtual-interview/InterviewSideBar",
    component: InterviewSideBar,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<InterviewSideBar />",
            },
        },
    },
}