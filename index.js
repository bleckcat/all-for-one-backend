const express = require("express")
var cors = require("cors")
const app = express()
const port = 3000
const bodyParser = require("body-parser")

var corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:8080"],
}

app.use(cors(corsOptions))

app.use(bodyParser.json())

const createCvRouter = require("./routes/create-cv")

app.use("/cv", createCvRouter)

app.listen(port, () => {
  console.log(`All for one is running on http://localhost:${port}`)
})
