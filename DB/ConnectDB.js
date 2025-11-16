const mongoose=require('mongoose')

// const LocalDB='mongodb://localhost:27017/Jobs'  // in that line that jobs is a database folder on a compass

const connectDB=async () => {
    try {
          await mongoose.connect(process.env.MONGO_URL)
        //  await mongoose.connect(process.env.livemongodb_url)
        console.log('MongoDB Connected')
    } catch (error) {
        console.log('MongoDB connection error',error)
    }
    
}
module.exports=connectDB