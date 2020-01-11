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

let allowCrossDomain = function(req, res, next) {
   res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Headers', "*");
   next();
};


const app = express();
app.use(allowCrossDomain);
const upload = multer({storage:storageConfig});




mongoClient.connect((err, client) => {
   if (err) {
      throw new Error('DataBase connect Error')
   } else {

      app.get('/', (req, res) => {
         res.send('hello')
      });

      app.get('/images/:imgName', (req, res) => {
         const {imgName} = req.params;

         res.sendFile(`${__dirname}/images/${imgName}`)
      });

      app.get('/product_list', (req, res) => {
         const db = client.db('elcor');
         const products = db.collection('products');

         products
             .find({})
             .toArray((err, products) => {
                res.append('Access-Control-Allow-Origin', '*');
                res.json(products)
             });
      });

      app.post('/add_product', upload.array('images'), (req, res, next) => {
         const {name, type, optionValues, optionType, prices, description} = req.body;

         const productItem = {
            name,
            type,
            options: {
               [optionType] : optionValues.split(',')
            },
            prices: prices.split(','),
            images: req.files.map(file => file.originalname),
            description: description.split(',')
         };

         const db = client.db('elcor');
         const products = db.collection('products');

         products.insertOne(productItem).then(() => res.json({"name": "post bob"}));
      });

      app.listen(PORT);




   }
});
