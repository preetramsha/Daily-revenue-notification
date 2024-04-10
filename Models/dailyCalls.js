const mongoose = require('mongoose');
const dailyCallsSchema = new mongoose.Schema({
  // Define a nested structure for storing apiCalls per service
  services: {
      type: Map,
      of: Number,
      default: {}
  },
  date: {
      type: String,
      default: function getCurrentDate() {
          const currentDate = new Date();
          const day = currentDate.getDate().toString().padStart(2, '0');
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const year = currentDate.getFullYear().toString().slice(-2);
          return `${day}/${month}/${year}`;
      }
  }
});

module.exports =  mongoose.model("dailyCalls", dailyCallsSchema);