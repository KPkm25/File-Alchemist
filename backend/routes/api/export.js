const express = require('express');
const util = require('util');
const ExcelJS = require('exceljs');
const router = express.Router();
const Employee = require('../../models/Employee');


router.get('/', async (req, res) => {
    try {
      // Fetch all employees from MongoDB
      const employees = await Employee.find();
  
      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Employees');
  
      // Define column headers
      worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Rank', key: 'rank', width: 15 },
        { header: 'Salary', key: 'salary', width: 15 },
        { header: 'Date of Joining', key: 'date_of_joining', width: 20 }
      ];
  
      // Add data rows
      employees.forEach(employee => {
  
        const date_of_joining = employee.date_of_joining ? employee.date_of_joining.toDateString() : 'null';
        worksheet.addRow({
          name: employee.name,
          rank: employee.rank,
          salary: employee.salary,
          date_of_joining: date_of_joining // Format date as a string
        });
      });
  
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');
  
      // Write workbook to response
      await workbook.xlsx.write(res);
  
      // End response
      res.end();
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ error: 'Error exporting data.' });
    }
  });

  module.exports = router;