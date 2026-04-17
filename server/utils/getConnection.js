const mongoose = require("mongoose");

const getConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
    console.log("✅ MongoDB is connected");
  } catch (error) {
    console.error("❌ MongoDB not connected", error);
  }
};

module.exports = getConnection;
