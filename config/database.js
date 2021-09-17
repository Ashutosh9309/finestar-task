const mongoose = require('mongoose');
const URL = "mongodb://localhost:27017/UserPost"
const connectDB = async () => {
  const conn = await mongoose.connect(URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB; 
