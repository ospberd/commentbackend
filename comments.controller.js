const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const config = require("./config.js");
const Comment = require( "./database.js");
//const {removeBannedTags, chkHtmlTags} = require("./commentcleaner.js");
const  {removeBannedTags} = require('./commentcleaner.js');
//import {chkHtmlTags, removeBannedTags} from "./commentcleaner.js";
// upload file path
const FILE_PATH = 'uploads'


// configure multer
const upload = multer({
  dest: `${FILE_PATH}/`,
  fileFilter: (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);
    if (file.mimetype == "image/png" 
      || file.mimetype == "image/jpg" 
      || file.mimetype == "image/jpeg"
      || file.mimetype == "image/gif" ) {
      cb(null, true);
    }
    else if (file.mimetype === "text/plain" && fileSize <= 102400) {
        cb(null, true)
    } else {
      cb(null, false);
   //   console.log("========== Only .gif, .png, .jpg and .txt(<102400) format allowed! ==========")
    //  return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }}
})

// add other middleware


// routes
router.get('/download/:id?',  downloadfile); 
router.get('/:id?/:count?/:page?/:orderby?/:direction?',  get); 
router.post('/:id?', upload.single('attFile'), post);


module.exports = router;

// route functions
//маршрут для скачивания файла

async function  downloadfile(req, res) {
    id = req.params.id 
    let loadComment = await Comment.findOne({where: {Id: id}  });
    var file = loadComment.originalFile;
    var fileLocation = './uploads/'+loadComment.savedFile;
    res.setHeader('Content-type', loadComment.mimeFile);
    res.download(fileLocation, file);
};

function get(req, res) {
    // set default values

    Id = req.params.id || "root";
    count = req.params.count || 25;
    page = req.params.page || 0;
    orderby = req.params.orderby || "createdAt";
    direction = req.params.direction || "DESC";  //  ASC|DESC;
    direction = direction.charAt(0).toUpperCase()=="D" ? "DESC" : "ASC";

    Comment.findAndCountAll({
            where: {parentId: Id,},
            order: [[orderby, direction]],
            limit: count,
            offset: (page*count),
        }).then(function (result) {
            res.statusCode = 200; res.json(result);
        }).catch(function (error) { 
            res.send(error.message)});
}

async function post(req, res) {
    // set default values
    console.log(req);
    id = req.params.id || "root";

    parentcoment = await Comment.findOne({where: {Id: id} , attributes: ['Id'], });
    if (!parentcoment && id!="root") 
        {res.statusCode = 404; res.send("No comment to reply!!!") }
        else {
            try {

            let content = removeBannedTags(req.body.content);

            let newComment = await Comment.create({ 
                    Id: uuidv4(),
                    parentId: id,
                    userName: req.body.userName, 
                    email: req.body.email, 
                    homePage: req.body.homePage,
                    content: content,
                 });

            if (!!req.file) {
                            
                    const result = await newComment.update(
                      { savedFile: res.req.file.filename ,
                       mimeFile: req.file.mimetype ,
                       originalFile:  req.file.originalname } 
                    )             
            }
 
            res.statusCode = 200; 
            res.send({
          
                status: true,
                message: 'Comment added File is uploaded.',
                data: {
                  user: req.body.userName,

                }
              })
            } catch (err) {
              
                res.statusCode = 400; 
                res.send({
              
                    status: false,
                    message: 'ERROR validate '+err
           
                  })
              
              }
        }





   // parentId = !!parentcoment ? parentcoment.Id:"root";
   

    


/*
    connection.query('SELECT * FROM comments WHERE ID=? ', [comment], function (err, results) { 
        if (err)  {res.statusCode = 503; return res.send(err.message)}
        else { res.json(results)  }
}); 
    

    connection.query('SELECT * FROM comments WHERE ParentID=? ORDER BY ? ? LIMIT ? OFFSET ?',
                [comment,orderby, direction, count, count*page  ], 
        function (err, results) { 
            if (err)  {res.statusCode = 503; return res.send(err.sqlMessage)}
            else { res.json(results)  }
    }); 
*/

}

