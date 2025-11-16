const CategoryModel = require('../Models/category')
const jobModel = require('../Models/jobModel')
const streamifier = require("streamifier");
const { cloudinary } = require('../Config/cloudinary');
const ApplicationModel = require('../Models/ApplicationModel');


class FrontController {
    static home = async (req, res) => {
        try {
            const category = await CategoryModel.find().sort({ createdAt: -1 })
            const jobs = await jobModel.find().sort({ createdAt: -1 })
            // console.log(Category)
            // console.log(job)
            res.render('home', { c: category, j: jobs })

        } catch (error) {
            console.log(error)
        }
    }
    static about = async (req, res) => {
        try {
            res.render('about')
        } catch (error) {
            console.log(error)
        }
    }
    static course = async (req, res) => {
        try {
            res.render('course page')
        } catch (error) {
            console.log(error)
        }
    }
    static contact = async (req, res) => {
        try {
            res.render('contact')
        } catch (error) {
            console.log(error)
        }
    }
    static login = async (req, res) => {
        try {
            res.render('login', { msg: req.flash("error"), success: req.flash("success") })
        } catch (error) {
            console.log(error)
        }
    }
    static register = async (req, res) => {
        try {
            res.render('register')
            req.flash("you are successfully registered")
        } catch (error) {
            console.log(error)
        }
    }

    static joblist = async (req, res) => {
        try {
            const jobs = await jobModel.find().sort({ createdAt: -1 })
            res.render('joblist', { jobs })
        } catch (error) {
            console.log(error)
        }
    }

    // static jobDetails = async (req, res) => {
    //     try {
    //         const id = req.params.id

    //         const job = await jobModel.findById(id)
    //         //  console.log(job)
    //         res.render('JobDetails', { job })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    static jobDetails = async (req, res) => {
        try {
            const jobId = req.params.id;
            const job = await jobModel.findById(jobId);

            let alreadyApplied = false;

            if (req.user) {
                const existingApplication = await ApplicationModel.findOne({
                    jobId: jobId,
                    userId: req.user.id
                });

                alreadyApplied = !!existingApplication;
            }

            res.render("jobdetails", {
                job: job,
                name: req.user?.name,
                alreadyApplied,
                success: req.flash('success'),
                error: req.flash('error')
            });
        } catch (error) {
            console.log(error);
        
        }
    };

    static jobApply = async (req, res) => {
        try {
            const jobId = req.params.id;

            //    console.log(req.file)
            //     console.log(req.body)
            // Cloudinary upload stream (for PDFs/Word docs)
            const bufferStream = streamifier.createReadStream(req.file.buffer);
            // अब req.file.buffer में आपका resume file as a buffer (RAM में store) है।
            // फिर इस buffer को Cloudinary पर upload किया जाता है।
            //         जब आप कोई file memory में upload करते हो (जैसे multer.memoryStorage() के साथ), तो वो file RAM में Buffer के रूप में होती है।

            // अब Cloudinary जैसे कुछ services file को stream के रूप में लेती हैं — ना कि सीधे buffer.

            // तो streamifier.createReadStream(buffer) इस buffer को stream में convert करता है ताकि आप उसे .pipe() करके किसी destination (जैसे Cloudinary) तक भेज सको।
            // console.log(bufferStream);
            const cloudinaryUpload = () =>
                new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "student_resume",
                            resource_type: "raw",
                        },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    bufferStream.pipe(stream);
                });

            const result = await cloudinaryUpload();
            await ApplicationModel.create({
                userId: req.user.id,
                jobId: jobId,
                resume: {
                    public_id: result.public_id,
                    url: result.secure_url,
                },
                coverLetter: req.body.coverLetter,
            })
            req.flash("success", "You have successfully applied for the job.");
            res.redirect("/jobdetails/" + jobId);
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

}
module.exports = FrontController