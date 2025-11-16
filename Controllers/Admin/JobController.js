const ApplicationModel = require("../../Models/ApplicationModel");
const CategoryModel = require("../../Models/category")
const JobModel = require("../../Models/jobModel")
//require cloudinary
const cloudinary=require('cloudinary')
cloudinary.config({ 
        cloud_name: 'dwvcrtwhm', 
        api_key: '291821638578444', 
        api_secret: 'wblmSo4y8M6RmzKjwN8nUmuQmDs' // Click 'View API Keys' above to copy your API secret
    });
class JobController {

    static dispay = async (req, res) => {
        try {
            const Jobs = await JobModel.find()
            const category=await CategoryModel.find()
            console.log(Jobs)

            res.render('admin/job/display', {
                title: 'dashboard',
                name: req.user.name,
                Jobs: Jobs,
                c:category,
                success: req.flash('success')
            })


        }
        catch (error) {
            console.log(error)
        }

    }
    static insertJobs = async (req, res) => {
        try {
            // console.log(req.files.image)
             
            //   console.log(imageUpload)

             console.log(req.body)
            const { category,title, companyName, description, location, jobType, salaryRange, skillsRequired, lastDateToApply} = req.body
             const file=req.files.image
            //   const imageUpload=await cloudinary.uploader.upload(file.tempFilePath,{
            //     folder:"image"
            //   })
            const result = await JobModel.create({
                category,
                title,
                companyName,
                description,
                location,
                jobType,
                
                salaryRange,
                skillsRequired,
                lastDateToApply,
                // image:{
                //     public_id:imageUpload.public_id,
                //     url:imageUpload.secure_url
                // }

            })
            req.flash("success", "Job Inserted Successfully")
            res.redirect('/job/display')
        }
        catch (error) {
            console.log(error)
        }

    }
    static viewJob = async (req, res) => {
        try {
            const id = req.params.id
            const Jobs = await JobModel.findById(id)  //data fetch mongodb
            // console.log(Jobs)
            res.render('admin/job/view', {
                title: 'dashboard',
                name: req.user.name,
                Jobs: Jobs,
                success: req.flash('success')
            })
        }

        catch (error) {
            console.log(error)
        }

    }
     static editJob = async (req, res) => {
        try {
            const id = req.params.id
            const Jobs = await JobModel.findById(id)  //data fetch mongodb
            // console.log(Jobs)
            res.render('admin/job/edit', {
                title: 'dashboard',
                name: req.user.name,
                Jobs: Jobs,
                success: req.flash('success')
            })
        }

        catch (error) {
            console.log(error)
        }

    }
      static updateJob = async (req, res) => {
        try {
            const id = req.params.id
            const { title } = req.body
            const Jobs = await JobModel.findByIdAndUpdate(id, {
                title
            }) //data fetch mognobd
            req.flash('success', "Job update Successfully")
            res.redirect("/job/display");

        } catch (error) {
            console.log(error)
        }
    }

      static deleteJob = async (req, res) => {
        try {
            const id = req.params.id
            // console.log(id)
            await JobModel.findByIdAndDelete(id)
            req.flash("success", "Job Delete successfully")
            res.redirect("/job/display")
        }

        catch (error) {
            console.log(error)
        }

    }

    static myApplication = async (req, res) => {
    try {
      const applications = await ApplicationModel.find({
        userId: req.user.id,
      })
        .populate({
          path: "jobId",
          populate: {
            path: "createdBy",
            model: "user",
          },
        })
        .sort({ appliedAt: -1 });
      // console.log(applications)

      res.render("admin/job/myApplications", {
        applications,
        user: req.user,
      });
    } catch (error) {
      console.error(error);
    }
  };

  static viewAllJobs = async (req, res) => {
    try {
      // Sare job applications fetch karenge, job aur user details ke saath
      const applications = await ApplicationModel.find()
        .populate("jobId") // sirf job ka title aur companyName lenge
        .populate("userId", "name email"); // user ka naam aur email bhi lenge
        console.log(applications)

      res.render("admin/job/applications", {
        applications,
        success: req.flash("success"),
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  };
  static updateApplicationStatus=async(req,res)=>{
    try {
       const appId = req.params.id;
      const newStatus = req.body.status;

      if (
        !["Pending", "Reviewed", "Interview", "Rejected"].includes(newStatus)
      ) {
        return res.status(400).send("Invalid status");
      }

      const application = await ApplicationModel.findByIdAndUpdate(
        appId,
        { status: newStatus },
        { new: true }
      ).populate("userId");

      if (!application) {
        return res.status(404).send("Application not found");
      }
      req.flash('success','Application Status Updated Successfully')
      res.redirect('/applicants')
    } catch (error) {
      console.log(error)
    }
  }


}
module.exports = JobController