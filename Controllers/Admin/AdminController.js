const userModel = require('../../Models/user')
const AdminModel = require('../../Models/admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');  //for generate token
const UserModel = require('../../Models/user');
const nodemailer=require('nodemailer')
const crypto = require('crypto');

class AdminController {
    static dashboard = async (req, res) => {
        try {
            res.render('admin/dashboard', { title: 'dashboard', name: req.user.name })
        }
        catch (error) {
            console.log(error)
        }
    }
    static userInsert = async (req, res) => {
        try {

            // console.log(req.body);
            const { name, email, password } = req.body;

            // Validate fields
            if (!name || !email || !password) {
                req.flash("error", "All fields are required");
                return res.redirect("/register");
            }

            // Check if email already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                req.flash("error", "Email already registered");
                return res.redirect("/register");
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create and save user
            const newUser = UserModel.create({
                name,
                email,
                password: hashedPassword,

            });
            req.flash("success", "user registered successfully");
            return res.redirect("/login");
        }
        catch (error) {
            console.log(error)
        }
    }

    static verifyLogin = async (req, res) => {
        try {
            // console.log(req.body)
            const { email, password } = req.body
            const user = await userModel.findOne({ email })
            // console.log(user)
            if (!user) {
                req.flash("error", "you are not registered User")
                return res.redirect('/login')


            } else {
                const isMatch = await bcrypt.compare(password, user.password)
                if (isMatch) {
                    var token = jwt.sign({ id: user._id, name: user.name, role: user.role , password:user.password }, process.env.Secret_Key);  //for generate token
                    // console.log(token)
                    res.cookie("token", token)  //that will use for generated token we can cookie on inspect>application>cookies>localhost
                    // return res.redirect('/dashboard')
                    // Role based redirect
                    if (user.role === "admin") {
                        return res.redirect("/dashboard");
                    } else if (user.role === "jobseeker") {
                        return res.redirect("/");
                    } else {
                        // Agar role unknown hai to login page
                        req.flash("error", "Invalid user role");
                        return res.redirect("/login");
                    }
                } else {
                    req.flash("error", "Email or Password not Match")
                    return res.redirect('/login')
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    static logout = async (req, res) => {
        try {
            res.clearCookie('token')
            req.flash("success", "logout successfully")
            return res.redirect('/login')
        } catch (error) {
            console.log(error)
        }
    }

    static forgotPassword = async (req, res) => {
        try {
            res.render("admin/forgot-password", {
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.log(error)
        }
    }
   
      static forgotpassword1 = async (req, res) => {
        try {
        const user = await userModel.findOne({ email: req.body.email });

      if (!user) {
        req.flash("error", "No user found with that email");
        return res.redirect("/forgotPassword");
      }

      const token = crypto.randomBytes(20).toString("hex");
      console.log(token)
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
      await user.save();

      // Send email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASS,
        },
      });

      const resetURL = `http://${req.headers.host}/reset-password/${token}`;

      await transporter.sendMail({
        to: user.email,
        from: "no-reply@pninfosys.com",
        subject: "Password Reset Request",
        html: `<p>You requested a password reset.</p>
               <p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
      });

      req.flash("success", "Reset link sent to your email");
      res.redirect("/forgotPassword");
        } catch (error) {
            console.log(error)
        }
    }
    // Show reset password form
  static async resetPasswordForm(req, res) {
    try {
      const user = await userModel.findOne({
        resetToken: req.params.token,
        resetTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        req.flash("error", "Token expired or invalid");
        return res.redirect("/forgot-password");
      }

      res.render("admin/reset-password", {
        token: req.params.token,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }

  // Handle password reset
  static async resetPassword(req, res) {
    try {
      const user = await userModel.findOne({
        resetToken: req.params.token,
        resetTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        req.flash("error", "Token expired or invalid");
        return res.redirect("/forgot-password");
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;

      await user.save();
      req.flash("success", "Password updated! You can now login.");
      res.redirect("/login");
    } catch (err) {
      console.log(err);
      req.flash("error", "Something went wrong");
      res.redirect("/forgot-password");
    }
  }

  static async changePassword(req,res){
    try {
        res.render('admin/changePassword',{
            success:req.flash('success'),
            error:req.flash('error')
        })
    
    } catch (error) {
       console.log(error) 
    }
  }

  static changepasswordUpdate = async (req, res) => {
        try {
            // console.log(req.body)
            const { oldPassword, newPassword } = req.body;
            const user = req.user;
            // console.log(user)
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/changePassword');
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                req.flash("error", "Old password is incorrect");
                return res.redirect("/login");
            }

            const hashpassword = await bcrypt.hash(newPassword, 10)

            // Update password
            await userModel.findByIdAndUpdate(user.id, {
                password: hashpassword
            });
            // Flash message + redirect
            req.flash('success', 'Password changed successfully');
            res.redirect('/changePassword');

        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = AdminController