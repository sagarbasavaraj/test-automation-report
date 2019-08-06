const mongoose = require("mongoose");
const config = require("config");

const URI = config.get("mongoURI");

class ReportDb {
  async connectDB() {
    let instance = null;
    try {
      instance = await mongoose.connect(URI, {
        dbName: "testautomationreports",
        useNewUrlParser: true
      });
      mongoose.set("useFindAndModify", false);
      console.log("connected to MongoDB.....");
    } catch (e) {
      console.error("Error in connecting to data base: ", e.message);
      process.exit();
    }
    return instance;
  }
}

module.exports = ReportDb;
