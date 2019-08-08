const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  category: String,  
  moduleName: String,
  buildNo: String,
  total: Number,
  passed: Number,
  failed: Number,
  running: Number
});

const ReportModel = mongoose.model("Report", reportSchema);

module.exports = ReportModel;
