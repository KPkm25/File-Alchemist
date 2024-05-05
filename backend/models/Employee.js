const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  rank: String,
  salary: Number,
  date_of_joining: Date
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
