const mongoose = require("mongoose")


async function dbConect() {
    await mongoose.connect(process.env.MONGOOSE_URI)
    .then(()=>{
        console.log("DataBase Connected");
        
    })
    .catch(err=>{
        console.log("Error conected to DB",err);
        
    })
}


module.exports = dbConect