const express = require('express');
const multer  = require('multer');
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "images");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});
const upload = multer({storage:storageConfig});
const app = express();
const PORT = 3000;


function startApp(client) {
    app.get('/', (req, res) => {
        res.send('Elcor backend server')
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

    app.post('/add_product', upload.array('images'), (req, res) => {
        const {name, type, options: optionValues, optionType, prices, descriptions} = req.body;

        const productItem = {
            name,
            type,
            options: {
                [optionType] : optionValues
            },
            prices,
            images: req.files.map(file => file.originalname),
            descriptions
        };

        const db = client.db('elcor');
        const products = db.collection('products');

        products.insertOne(productItem).then(() => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            products.find({}).toArray((err, productList) => res.json(productList))
        });

    });

    app.listen(PORT)
}



module.exports = startApp;
