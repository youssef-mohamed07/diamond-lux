import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const deleteFile = (filename, folderName) => {
    try {
        const filePath = path.join(__dirname, `../../uploads/${folderName}`, filename)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    } catch (error) {
        console.error('Error deleting file:', error)
    }
}

export const extractFilename = (url) => {
    if (!url) return null
    return url.split('/').pop()
} 