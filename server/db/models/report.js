const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  category: String,  
  moduleName: String,
  buildNo: String,
  total: Number,
  passed: Number,
  failed: Number,
  running: Number,
  details: [Object]
});

const ReportModel = mongoose.model("Report", orderSchema);

module.exports = ReportModel;
