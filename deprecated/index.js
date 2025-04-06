const express = require("express")
const fileupload = require("express-fileupload")
const pdfParse = require("pdf-parse")

const app = express()

app.use("/",express.static("public"));
app.use(fileupload());

app.post("/extract-text", (req,res) => {
  if (!req.files && !req.files.pdfFile) {
    return res.status(400).send({error: "No file uploaded"})
  }

  pdfParse(req.files.pdfFile).then(result => {
    res.send(result.text);
  })
})

app.listen(3000)