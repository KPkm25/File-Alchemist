const express = require('express');
const multer = require('multer');
const fs = require('fs');
const util = require('util');
const parseString = util.promisify(require('xml2js').parseString);
const router = express.Router();
const Employee = require('../../models/Employee');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/', upload.single('xml'), async (req, res) => {
    try {
      // Parse XML data
      const xmlData = fs.readFileSync(req.file.originalname, 'utf-8');
      const jsonResult = await parseString(xmlData);
      const employees = jsonResult.employees.employee;
  
      // Insert each employee into MongoDB
      for (const emp of employees) {
        // Check if all required fields exist
          let name = 'null';
          let rank = 'null';
          let salary = 0;
          let date_of_joining = null;
  
          if (emp.name && emp.name[0]) {
            name = emp.name[0];
          }
  
          // Check if rank exists and is not empty
          if (emp.rank && emp.rank[0]) {
            rank = emp.rank[0];
          }
  
          // Check if salary exists and is a valid number
          if (emp.salary && !isNaN(parseInt(emp.salary[0]))) {
            salary = parseInt(emp.salary[0]);
          }
  
          // Check if date_of_joining exists and is a valid date
          if (emp.date_of_joining && emp.date_of_joining[0]) {
            date_of_joining = new Date(emp.date_of_joining[0]);
          }
          // Create employee document with available data
          const employeeData = {
            name: name,
            rank: rank,
            salary: salary,
            date_of_joining: date_of_joining
          };
          // Insert into MongoDB
          await Employee.create(employeeData); 
      }
  
      console.log('Data uploaded successfully');
      res.status(200).json("success");
    } catch (error) {
      console.error('Error uploading data:', error);
      res.status(500).json({ error: 'Error uploading data to the database.' });
    }
  });

  module.exports = router;