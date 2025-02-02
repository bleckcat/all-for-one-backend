const express = require("express")
const router = express.Router()
const XLSX = require("xlsx-populate")
const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")

router.post("/create-pt-cv", async (req, res) => {
  try {
    // Load the workbook
    const workbook = await XLSX.fromFileAsync(
      path.join(__dirname, "../mocks/Curriculo_PT.xlsx")
    )
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const day = date.getDate()
    // Perform your edits on the workbook
    workbook.sheet("Português").cell("D1").value(`${year}`)
    workbook.sheet("Português").cell("E1").value(`${month}`)
    workbook.sheet("Português").cell("F1").value(`${day}`)
    workbook.sheet("Português").cell("A5").value("Nome teste")
    workbook.sheet("Português").cell("A7").value("00/00/0000")
    workbook.sheet("Português").cell("F7").value("25")
    workbook.sheet("Português").cell("H7").value("F")
    workbook.sheet("Português").cell("K9").value("9999-9999")
    workbook.sheet("Português").cell("K11").value("+55 (11) 99999-9999")
    workbook.sheet("Português").cell("K13").value("example.teste@teste.com")
    workbook.sheet("Português").cell("A10").value("Rua Campo Santo - Teste - SP - 09000-000")
    workbook.sheet("Português").cell("A14").value("Alguma informação")
    workbook.sheet("Português").cell("A17").value("2022/Jan")
    workbook.sheet("Português").cell("C17").value("Arquiteto de carpinetaria para sapos")
    workbook.sheet("Português").cell("A33").value("2015/Dez")
    workbook.sheet("Português").cell("C33").value("Escola dozinbabue")
    workbook.sheet("Português").cell("A39").value("2019/Dez")
    workbook.sheet("Português").cell("C39").value("Autorização de sapo")
    workbook.sheet("Português").cell("C45").value("Eu gosto muito de sapos, eles são muito legais e eu quero trabalhar com eles.")
    workbook.sheet("Português").cell("I45").value("01:00 - 15:00")
    workbook.sheet("Português").cell("I47").value("1")
    workbook.sheet("Português").cell("I49").value("Sim")
    workbook.sheet("Português").cell("K49").value("Não")
    workbook.sheet("Português").cell("A45").value("Quero trabalhar com sapos, meu negocio e com eles.")


    // Get the workbook as a buffer
    const buffer = await workbook.outputAsync()

    // Paths for the input and output files
    const inputFile = path.join(__dirname, "../mocks/Curriculo_PT_edited.xlsx")

    // Write the buffer to a temporary file
    await fs.promises.writeFile(inputFile, buffer)

    const outputFile = path.join(__dirname, "../mocks/Curriculo_PT_edited.pdf")
    // Command to convert XLSX to PDF using LibreOffice
    const command = `soffice --headless --convert-to pdf --outdir "${path.dirname(
      outputFile
    )}" "${inputFile}"`

    // Execute the command
    exec(command, async (error) => {
      if (error) {
        console.error(`Error converting to PDF: ${error.message}`)
        return res.status(500).send("Error converting Excel to PDF.")
      }

      // Remove the temporary XLSX file
      await fs.promises.unlink(inputFile)

      console.log("PDF created successfully")

      // Read the converted PDF file
      const pdfBuffer = fs.readFileSync(outputFile)

      // Send the PDF to the user
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="Curriculo.pdf"'
      )
      res.send(pdfBuffer)
    })
  } catch (error) {
    console.error(error)
    res.status(500).send("An error occurred while creating the PDF.")
  }
})

module.exports = router
