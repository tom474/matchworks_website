import dotenv from "dotenv"
dotenv.config()

import express, { Application, Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import connectToMongoDB from "./config/database"
import router from "./routes"
import errorHandler from "./middlewares/errorHandlerMiddleware"

// Initialize the server
const app: Application = express()
const port: string = process.env.SERVER_PORT || "8080"
if (process.env.CLIENT_URL?.endsWith("/")) {
    process.env.CLIENT_URL = process.env.CLIENT_URL.slice(0, -1)
}
const clientURL: string = process.env.CLIENT_URL || "http://localhost:5173"

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: clientURL,
        optionsSuccessStatus: 200,
        credentials: true,
    })
)
app.use(cookieParser())
app.use(morgan("dev"))
app.use(errorHandler)

// Router
app.use("/api", router)

// Health check
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "Server is running!" })
})

// Start the server
const startServer = async () => {
    try {
        await connectToMongoDB()
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`)
        })
    } catch (error) {
        console.error("Error starting the server:", error)
        process.exit(1)
    }
}

startServer()
