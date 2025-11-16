
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
 category:{
  type:String,
  required:true
 },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    default: 'full-time'
  },
  salaryRange: {
    type: String,
    required: true
  },
  skillsRequired: {
    type: [String], // e.g. ['JavaScript', 'Node.js']
    required: true
  },
  // postedBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // posted by employer
  //   required: true
  // },
  lastDateToApply: {
    type: Date,
    required: true
  },
  // image:{
  //   public_id:{type:String},
  //   url:{type:String}
  // },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  
});


// const JobModel=mongoose.model('AddJobs',jobSchema)
// module.exports = JobModel
module.exports = mongoose.model('job', jobSchema);