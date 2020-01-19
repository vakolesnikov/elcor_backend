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
app.use(express.json());
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
        const {name, type, options: optionValues, optionType, prices, descriptions, _id} = req.body;

        const productItem = {
            _id,
            name,
            type,
            options: {
                [optionType] : Array.isArray(optionValues) ? optionValues : [optionValues]
            },
            prices: Array.isArray(prices) ? prices: [prices],
            images: req.files.map(file => file.originalname),
            descriptions: Array.isArray(descriptions) ? descriptions : [descriptions]
        };

        const db = client.db('elcor');
        const products = db.collection('products');

        products.insertOne(productItem).then(() => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            products.find({}).toArray((err, productList) => res.json(productList))
        });

    });

    app.post('/update_product', upload.array('images'), (req, res) => {
        const db = client.db('elcor');
        const products = db.collection('products');
        const {_id} = req.body;

        products.find({_id}).toArray((err, productsList) => {
           const oldImages = productsList[0].images;
           const newImages = req.files.map(file => file.originalname);
           const images = newImages.reduce((acc, image) => acc.includes(image) ? acc : [...acc, image], oldImages);
           console.log(images);
           const {name, type, options: optionValues, optionType, prices, descriptions, _id} = req.body;
           const productItem = {
                _id,
                name,
                type,
                options: {
                    [optionType] : optionValues
                },
                prices,
                images,
                descriptions
            };

            products.update({_id}, {...productItem}).then(() => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
                products.find({}).toArray((err, newProductList) => res.json(newProductList))
            });
        });

    });

    app.post('/remove_product', upload.none(), (req, res) => {
        const {_id} = req.body;
        const db = client.db('elcor');
        const products = db.collection('products');

        products.deleteOne({_id}).then(() => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
            products.find({}).toArray((err, productList) => res.json(productList))
        }).catch(err => err);
    });

    app.listen(PORT)
}



module.exports = startApp;
