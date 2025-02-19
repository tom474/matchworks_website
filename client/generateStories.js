import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.join(__dirname, "src", "components")

const excludeDirs = ["ui", "rich-text"]

function generateStoryTemplate(parentName, componentName) {
    return `import ${componentName} from "./${componentName}"

import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ${componentName}> = {
    title: "${parentName}/${componentName}",
    component: ${componentName},
    tags: ["autodocs"]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => <></>,
    parameters: {
        docs: {
            source: {
                code: "<${componentName} />",
            },
        },
    },
}`
}

function generateStories(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
        const entryPath = path.join(dir, entry.name)

        if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
            generateStories(entryPath) // Recursive call for subdirectories
        } else if (
            entry.isFile() &&
            entry.name.match(/\.jsx?$|\.tsx?$/) &&
            /^[A-Z]/.test(entry.name)
        ) {
            const componentName = path.basename(
                entry.name,
                path.extname(entry.name)
            )
            const storyFileName = `${componentName}.stories.tsx`
            const storyFilePath = path.join(dir, storyFileName)

            if (!fs.existsSync(storyFilePath)) {
                const parentName = path.basename(dir)
                const storyContent = generateStoryTemplate(
                    parentName,
                    componentName
                )
                fs.writeFileSync(storyFilePath, storyContent)
                console.log(`Story created for component: ${componentName}`)
            }
        }
    }
}

// Run the story generation script
generateStories(componentsDir)
