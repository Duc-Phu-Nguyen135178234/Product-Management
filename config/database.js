const mongoose = require('mongoose');

module.exports.connect =()=>{
    try {
        mongoose.connect(process.env.MONGO_URL) 
        console.log("Success to connection")
    } catch (error) {
        console.log(error)
    }
}

