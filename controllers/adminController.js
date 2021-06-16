const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const Price = require('../models/PriceModel').Price;
const {isEmpty} = require('../config/customFunctions');
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {

    index: (req, res) => {
        res.render('admin/index');

    },


    /* ADMIN POSTS ENDPOINTS */


    getPosts: (req, res) => {
        Post.find().lean()
            .populate('category')
            .then(posts => {
                res.render('admin/posts/index', {posts: posts});
            });
    },
    getPostsByCategory: (req, res) => {
        Post.find({category:ObjectId(req.params.id)}).lean()
            .populate('posts')
            .then(posts => {
                res.render('admin/category/disposition', {posts: posts});
            });
    },

    getCreatePostPage: (req, res) => {
        Category.find().lean().then(cats => {

            res.render('admin/posts/create', {categories: cats});
        });


    },

    submitCreatePostPage: (req, res) => {

        const commentsAllowed = !!req.body.allowComments;

        // Check for any input file
        let filename = '';

        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
        }

        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${filename}`
        });

        newPost.save().then(post => {
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        });
    },

    getEditPostPage: (req, res) => {
        const id = req.params.id;

        Post.findById(id).lean()
            .then(post => {
                Category.find().lean().then(cats => {
                    res.render('admin/posts/edit', {post: post, categories: cats});
                });
            });
    },

    submitEditPostPage: (req, res) => {
       const post = {
            title : req.body.title,           
            description : req.body.description,
            category : req.body.category,
            
        }
        
        const id = req.params.id;
        Post.findByIdAndUpdate(id, 
            {$set : post},
            {new : true},
            (err, docs) =>{
                if(!err) {
                req.flash('success-message', `Le poste a été modifié avec succès !`)
                res.redirect('/admin/posts')
                }
                else console.log("update err :" + err)

            })
         
    },

    deletePost: (req, res) => {
      

        Post.findByIdAndRemove(req.params.id,

            (err)=>{
                
                if(!err) {
                    req.flash('success-message', `Le poste a été supprimé avec succès !`)
                    res.redirect('/admin/posts')
                }
                else console.log("delete err :" + err)
            } 
            )
           
    },


    /* ALL CATEGORY METHODS*/
    getCategories: (req, res) => {

        Category.find().lean().then(cats => {
            res.render('admin/category/index', {categories: cats});
        });
    },

    createCategories: (req, res) => {
        let categoryName = req.body.name;

        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }

    },

    getEditCategoriesPage: async (req, res) => {
        const catId = req.params.id;

        const cats = await Category.find().lean();


        Category.findById(catId).lean().then(cat => {

            res.render('admin/category/edit', {category: cat, categories: cats});

        });
    },


    submitEditCategoriesPage: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if (newTitle) {
            Category.findById(catId).lean().then(category => {

                category.title = newTitle;

                category.save().then(updated => {
                    res.status(200).json({url: '/admin/category'});
                });

            });
        }
    },
    deleteCategory: (req, res) => {
     

        Category.findByIdAndRemove(req.params.id,

            (err)=>{
                
                if(!err) {
                    req.flash('success-message', `Le catégorie a été supprimé avec succès !`)
                    res.redirect('/admin/category')
                }
                else console.log("delete err :" + err)
            } 
            )
           
    },
    getDispositionCategoriesPage: async (req, res) => {
        const catId = req.params.id;

        const cats = await Category.find().lean();


        Category.findById(catId).lean().then(cat => {

            res.render('admin/category/disposition', {category: cat, categories: cats});

        });
    },
    


    /* COMMENT ROUTE SECTION*/
    getComments: (req, res) => {
        Comment.find().lean()
            .populate('user')
            .then(comments => {
                res.render('admin/comments/index', {comments: comments});
            })
    },

    getPrice : (req, res) => {
        Price.find().lean()
        
        .then(prices => {
            res.render('admin/price/index', {prices : prices})
        })
    },
    submitCreatePricePage: (req, res) => {

        
        const newPrice = new Price({
            title: req.body.title,
            price : req.body.price,
            details: req.body.details

           
           
        });

        newPrice.save().then(prices=> {
            req.flash('success-message', 'Tarif créer avec succès.');
            res.redirect('/admin/price');
        });
    },
    getEditPricePage: async (req, res) => {
        const priceId = req.params.id;

        const pri = await Price.find().lean();


        Price.findById(priceId).lean().then(price => {

            res.render('admin/price/edit', {price: price, prices: pri});

        });
    },     
    submitEditPricePage: (req, res) => {
        const price = {
             title : req.body.title,           
             price : req.body.price,
             details : req.body.details,
             
         }
         
         const id = req.params.id;
         Price.findByIdAndUpdate(id, 
             {$set : price},
             {new : true},
             (err, docs) =>{
                 if(!err) {
                 req.flash('success-message', `Le tarif a été modifié avec succès !`)
                 res.redirect('/admin/price')
                 }
                 else console.log("update err :" + err)
 
             })
          
     },
    deletePrice: (req, res) => {
      

        Price.findByIdAndRemove(req.params.id,

            (err)=>{
                
                if(!err) {
                    req.flash('success-message', `Le tarif a été supprimé avec succès !`)
                    res.redirect('/admin/price')
                }
                else console.log("delete err :" + err)
            } 
            )
           
    },
    deletePriceDetails : (req, res) => {
        let priceDetails = Price.find({details : req.body.details})
        Price.updateOne(req.params.id, {$pull : {details: priceDetails}},
            
            (err)=>{
                
                if(!err) {
                    req.flash('success-message', `Le detail a été supprimé avec succès !`)
                    res.redirect('/admin/price')
                }
                else console.log("delete err :" + err)
            } 
            )

    }
};

/* ADMIN CATEGORY ROUTES*/


