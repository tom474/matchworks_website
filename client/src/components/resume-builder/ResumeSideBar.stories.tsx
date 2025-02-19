import ResumeSideBar from "./ResumeSideBar"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ResumeSideBar> = {
    title: "resume-builder/ResumeSideBar",
    component: ResumeSideBar,
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<ResumeSideBar />",
            },
        },
    },
}