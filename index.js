const express = require('express');
const cors = require('cors');
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
const upload = multer({storage:storageConfig});

// const corsOptions = {
//    origin: '*',
//    optionsSuccessStatus: 200
// };

const app = express();
// app.use(cors(corsOptions));






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

      app.get('/product_list', (req, res, next) => {
         const db = client.db('elcor');
         const products = db.collection('products');

         products
             .find({})
             .toArray((err, products) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
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
