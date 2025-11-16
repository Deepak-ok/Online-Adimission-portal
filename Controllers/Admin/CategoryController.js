const CategoryModel = require('../../Models/category')
class CategoryController {

    static dispay = async (req, res) => {
        try {
            const category = await CategoryModel.find()  //data fetch mongodb
            // console.log(category)
            res.render('admin/category/display', {
                title: 'dashboard',
                name: req.user.name,
                c: category,
                success: req.flash('success')
            })
        }
        catch (error) {
            console.log(error)
        }

    }

    static insertCategory = async (req, res) => {
        try {
            //   console.log(req.body)
            const { title } = req.body
            const result = await CategoryModel.create({
                title
            })
            req.flash("success", "category insert successfully")
            res.redirect('/category/display')
        }
        catch (error) {
            console.log(error)
        }

    }

    static deleteCategory = async (req, res) => {
        try {
            const id = req.params.id
            // console.log(id)
            await CategoryModel.findByIdAndDelete(id)
            req.flash("success", "category Delete successfully")
            res.redirect("/category/display")
        }

        catch (error) {
            console.log(error)
        }

    }

    static viewCategory = async (req, res) => {
        try {
            const id = req.params.id
            const category = await CategoryModel.findById(id)  //data fetch mongodb
            console.log(category)
            res.render('admin/category/view', {
                title: 'dashboard',
                name: req.user.name,
                c: category,
                success: req.flash('success')
            })
        }

        catch (error) {
            console.log(error)
        }

    }

    static editCategory = async (req, res) => {
        try {
            const id = req.params.id
            const category = await CategoryModel.findById(id)  //data fetch mongodb
            console.log(category)
            res.render('admin/category/edit', {
                title: 'dashboard',
                name: req.user.name,
                c: category,
                success: req.flash('success')
            })
        }

        catch (error) {
            console.log(error)
        }

    }
    static UpdateCategory = async (req, res) => {
        try {
            const id = req.params.id
            const { title } = req.body
            const category = await CategoryModel.findByIdAndUpdate(id, {
                title
            }) //data fetch mognobd
            req.flash('success', "Category update Successfully")
            res.redirect("/category/display");

        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = CategoryController