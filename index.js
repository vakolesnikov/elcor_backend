const express = require('express');
const {MongoClient} = require('mongodb');
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
const PORT = 3000;

const multer  = require("multer");
const storageConfig = multer.diskStorage({
   destination: (req, file, cb) =>{
      cb(null, "uploads");
   },
   filename: (req, file, cb) =>{
      cb(null, file.originalname);
   }
});

const app = express();

app.use(multer({storage:storageConfig}).single("filedata"));
app.use(express.json());

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
                console.log(products);
                res.json(products)
             });
      });

      app.post('/add_product', (req, res) => {
         console.log(req.body);

         res.json({"name": "post bob"})
      });

      app.listen(PORT);




   }
});
