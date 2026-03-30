const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()
const connectToDB = require("./src/config/database")
connectToDB();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:"*",
  credentials: true
}));

/* require all the routes here */
const authRouter = require("./src/routes/auth.routes")
const interviewRouter = require("./src/routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})