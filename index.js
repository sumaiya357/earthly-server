const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

//middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cno8kmu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
         const productsCollection = client.db('earthlyDelights').collection('products');
         const flowersCollection = client.db('earthlyDelights').collection('flowers');
         const fruitsCollection = client.db('earthlyDelights').collection('fruits');
         const indoorsCollection = client.db('earthlyDelights').collection('indoors');
         const bonsaiCollection = client.db('earthlyDelights').collection('bonsai');
         const addedProductsCollection = client.db('earthlyDelights').collection('addedProducts');

         app.get('/products', async(req, res) => {
            const query = {};
            const allProducts = await productsCollection.find(query).toArray();
            res.send(allProducts);
         })

         app.get('/flowers', async(req, res) => {
            const query = {};
            const allFlowers = await flowersCollection.find(query).toArray();
            res.send(allFlowers);
         })

         app.get('/fruits', async(req, res) => {
            const query = {};
            const allFruits = await fruitsCollection.find(query).toArray();
            res.send(allFruits);
         })

         app.get('/indoors', async(req, res) => {
            const query = {};
            const allIndoors = await indoorsCollection.find(query).toArray();
            res.send(allIndoors);
         })
         app.get('/bonsai', async(req, res) => {
            const query = {};
            const allBonsai = await bonsaiCollection.find(query).toArray();
            res.send(allBonsai);
         })
         
         app.post('/addedProducts' , async(req, res) => {
                 const addedProduct = req.body;
                 const result = await productsCollection.insertOne(addedProduct);
                 res.send(result);
         })
    }
    finally{
    }
}

run().catch(console.log);



app.get('/',async(req, res) => {
    res.send('loading from earthly delights')
});


app.listen(port, () => {
    console.log(`Earthly server is listening on ${port}`)
})




// const products = require('./product.json')
// app.get('/product',(req, res) => {
//     res.send(products)
// });