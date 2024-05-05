const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("excel"), async (req, res) => {
  try {
    // Read the uploaded Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer); // Create a new PDF document

    const pdfDoc = new PDFDocument();
    const buffers = []; // Extract data from Excel and add to PDF

    const worksheet = workbook.getWorksheet(1); // Assuming data is on the first worksheet

    const columnSpacing = 10;
    const maxColsPerPage = 6; // Maximum number of columns per page
    const maxRowsPerPage = 27; // Maximum number of rows per page
    const pageHeight = pdfDoc.page.height - 50; // Height of the page minus margins // Determine column widths dynamically based on the longest entry in each column

    const columnWidths = [];
    worksheet.eachRow((row) => {
      row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
        columnWidths[colIndex] = Math.max(
          columnWidths[colIndex] || 0,
          cell.value ? cell.value.toString().length : 0
        );
      });
    });

    let currentPage = 1;
    let curPage = 1;
    let currentY = 50; // Starting Y position // Function to print columns and rows // Function to print columns and rows

    const printColumns = (rows, startColumnIndex) => {
      let xPos = 50;
      // console.log("Right col", rows)

      rows.forEach((row) => {
        let yPos = currentY;
        let colsToPrint = maxColsPerPage;
        if (startColumnIndex === 7) {
          // For the second set of pages, adjust the number of columns to print
          colsToPrint = Math.min(maxColsPerPage, row.actualCellCount - 6);
        }
        for (let i = 0; i < colsToPrint; i++) {
          const colIndex = startColumnIndex + i;
          const cell = row.getCell(colIndex);
          let cellValue = "";
          if (cell.value && typeof cell.value === "object" && cell.value.text) {
            // If the cell value is an object with a 'text' property, use that as the cellValue
            cellValue = cell.value.text;
          } else if (cell.value && typeof cell.value === "string") {
            // If the cell value is a string, check for email addresses using regular expressions
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            const matches = cell.value.match(emailRegex);
            if (matches && matches.length > 0) {
              // If email addresses are found, concatenate them into the cellValue
              cellValue = matches.join(", ");
            } else {
              // If no email addresses are found, use the original cell value
              cellValue = cell.value;
            }
          } else {
            // If the cell value is not an object or a string, use the original cell value
            cellValue = cell.value ? cell.value.toString() : "";
          }
          pdfDoc.text(cellValue, xPos, yPos);
          xPos += (columnWidths[colIndex] || 0) * 7 + columnSpacing;
        }
        currentY +=
          pdfDoc.heightOfString(
            row.getCell(startColumnIndex).value
              ? row.getCell(startColumnIndex).value.toString()
              : ""
          ) + 10;
        xPos = 50;
      });
    };

    const printLeftColumns = (rows, startColumnIndex) => {
      let xPos = 50;
      // console.log("Right col", rows)

      rows.forEach((row) => {
        let yPos = currentY;
        let colsToPrint = maxColsPerPage;
        colsToPrint = Math.min(maxColsPerPage, row.actualCellCount - 6);
        for (let i = 0; i < colsToPrint; i++) {
          const colIndex = startColumnIndex + i;
          const cell = row.getCell(colIndex);
          let cellValue = "";
          if (cell.value && typeof cell.value === "object" && cell.value.text) {
            // If the cell value is an object with a 'text' property, use that as the cellValue
            cellValue = cell.value.text;
          } else if (cell.value && typeof cell.value === "string") {
            // If the cell value is a string, check for email addresses using regular expressions
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            const matches = cell.value.match(emailRegex);
            if (matches && matches.length > 0) {
              // If email addresses are found, concatenate them into the cellValue
              cellValue = matches.join(", ");
            } else {
              // If no email addresses are found, use the original cell value
              cellValue = cell.value;
            }
          } else {
            // If the cell value is not an object or a string, use the original cell value
            cellValue = cell.value ? cell.value.toString() : "";
          }
          pdfDoc.text(cellValue, xPos, yPos);
          xPos += (columnWidths[colIndex] || 0) * 7 + columnSpacing;
        }
        currentY +=
          pdfDoc.heightOfString(
            row.getCell(startColumnIndex).value
              ? row.getCell(startColumnIndex).value.toString()
              : ""
          ) + 10;
        xPos = 50;
      });
    };

    worksheet.eachRow((row, rowIndex) => {
      // If enough rows to fill a page, print them
      if (
        (rowIndex + 1) % maxRowsPerPage === 0 ||
        currentY + row.height > pageHeight
      ) {
        if (currentPage <= Math.ceil(worksheet.rowCount / maxRowsPerPage)) {
          // Print the first 6 columns on the first set of pages
          console.log("Left col", rowIndex - maxRowsPerPage + 1);

          printColumns(
            worksheet.getRows(rowIndex - maxRowsPerPage + 1, maxRowsPerPage),
            1
          );
        }

        currentY = 50; // Reset Y position for the new page
        pdfDoc.addPage();
        currentPage++;
      }
    });
    // Print remaining rows if any
    if (worksheet.rowCount % maxRowsPerPage !== 0) {
      if (currentPage <= Math.ceil(worksheet.rowCount / maxRowsPerPage)) {
        console.log("current page is", currentPage); // For the remaining rows in the first set of pages, print the first 6 columns
        printColumns(
          worksheet.getRows(
            maxRowsPerPage * (currentPage - 1) + 1,
            worksheet.rowCount % maxRowsPerPage
          ),
          1
        );
      }
    }

    pdfDoc.addPage();
    currentY = 50; // Starting Y position // Function to print columns and rows // Function to print columns and rows

    worksheet.eachRow((row, rowIndex) => {
      // If enough rows to fill a page, print them
      if (
        (rowIndex + 1) % maxRowsPerPage === 0 ||
        currentY + row.height > pageHeight
      ) {
        if (
          currentPage === Math.ceil(worksheet.rowCount / maxRowsPerPage) &&
          curPage <= Math.ceil(worksheet.rowCount / maxRowsPerPage)
        ) {
          // Print the remaining columns, starting from the 7th column onwards, on the second set of pages

          console.log("reached else", rowIndex - maxRowsPerPage + 1);
          printLeftColumns(
            worksheet.getRows(rowIndex - maxRowsPerPage + 1, maxRowsPerPage),
            7
          );
        }
        currentY = 50; // Reset Y position for the new page
        pdfDoc.addPage();
        curPage++;
      }
    });
    // Print remaining rows if any
    if (worksheet.rowCount % maxRowsPerPage !== 0) {
      if (curPage <= Math.ceil(worksheet.rowCount / maxRowsPerPage)) {
        // For the remaining rows in the second set of pages, print the remaining columns starting from the 7th column onwards
        console.log("reached else");
        printLeftColumns(
          worksheet.getRows(
            maxRowsPerPage *
              (curPage - Math.ceil(worksheet.rowCount / maxRowsPerPage)) +
              1,
            worksheet.rowCount % maxRowsPerPage
          ),
          7
        );
      }
    }

    pdfDoc.on("data", buffers.push.bind(buffers));
    pdfDoc.on("end", () => {
      // Concatenate all buffer chunks into a single buffer
      const pdfData = Buffer.concat(buffers); // Send the PDF data in the response
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
        "Content-Length": pdfData.length,
      });
      res.end(pdfData);
    });
    pdfDoc.end();
  } catch (error) {
    console.error("Error converting Excel to PDF:", error);
    res.status(500).json({ error: "Error converting Excel to PDF." });
  }
});

module.exports = router;
