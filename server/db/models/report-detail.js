const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReportDetailSchema = new Schema({
  moduleName: String,
  ipAddress: String,
  buildNo: String,
  smokeStatus: String,
  deploymentStatus: String,
  regressionStatus: String,
  datetime: Date
});

const ReportDetailModel = mongoose.model("ReportDetail", ReportDetailSchema);

module.exports = ReportDetailModel;
