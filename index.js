const express = require('express');
const {MongoClient} = require('mongodb');
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
const PORT = 3000;

const multer  = require("multer");
const storageConfig = multer.diskStorage({
   destination: (req, file, cb) =>{
      cb(null, "images");
   },
   filename: (req, file, cb) =>{
      cb(null, file.originalname);
   }
});

const app = express();
const upload = multer({storage:storageConfig});




mongoClient.connect((err, client) => {
   if (err) {
      throw new Error('DataBase connect Error')
   } else {

      app.get('/', (req, res) => {
         res.send('hello')
      });

      app.get('/product_list', (req, res) => {
         const db = client.db('elcor');
         const products = db.collection('products');

         products
             .find({})
             .toArray((err, products) => {
                res.json(products)
             });
      });

      app.post('/add_product', upload.array('images'), (req, res, next) => {
         console.log(req.files.map(file => file.originalname));


         // res.json({"name": "post bob"});
      });

      app.listen(PORT);




   }
});
