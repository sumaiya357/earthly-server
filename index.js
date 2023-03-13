const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

//middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cno8kmu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//VERFY JWT 
function verifyJWT(req, res, next){
   // console.log('token inside VerifyJWT', req.headers.authorization);
   const authHeader = req.headers.authorization;
   if(!authHeader){
      return res.status(401).send('unauthorized access')
   }

   const token = authHeader.split(' ')[1];

   jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
      if(err){
         return res.status(403).send({message: 'forbiden access'})
      }
      req.decoded = decoded;
      next();
   })
}
async function run() {
   try {
      const productsCollection = client.db('earthlyDelights').collection('products');
      const flowersCollection = client.db('earthlyDelights').collection('flowers');
      const fruitsCollection = client.db('earthlyDelights').collection('fruits');
      const indoorsCollection = client.db('earthlyDelights').collection('indoors');
      const bonsaiCollection = client.db('earthlyDelights').collection('bonsai');
      const spicesCollection = client.db('earthlyDelights').collection('spices');
      const toolsCollection = client.db('earthlyDelights').collection('tools');
      const addedProductsCollection = client.db('earthlyDelights').collection('addedProducts');

      const usersCollection = client.db('earthlyDelights').collection('users');

      app.get('/products', async (req, res) => {
        
         const query = {};
         const allProducts = await productsCollection.find(query).toArray();
         res.send(allProducts);
      })

      app.get('/flowers', async (req, res) => {
         const query = {};
         const allFlowers = await flowersCollection.find(query).toArray();
         res.send(allFlowers);
      })

      app.get('/fruits', async (req, res) => {
         const query = {};
         const allFruits = await fruitsCollection.find(query).toArray();
         res.send(allFruits);
      })

      app.get('/indoors', async (req, res) => {
         const query = {};
         const allIndoors = await indoorsCollection.find(query).toArray();
         res.send(allIndoors);
      })
      app.get('/bonsai', async (req, res) => {
         const query = {};
         const allBonsai = await bonsaiCollection.find(query).toArray();
         res.send(allBonsai);
      })
      app.get('/spices', async (req, res) => {
         const query = {};
         const spices = await spicesCollection.find(query).toArray();
         res.send(spices);
      })
      app.get('/tools', async (req, res) => {
         const query = {};
         const tools = await toolsCollection.find(query).toArray();
         res.send(tools);
      })

      //SEND THE PRODUCTS TO BACKEND BY ADMIN
      app.post('/addedProducts', async (req, res) => {
         const addedProduct = req.body;
         const result = await productsCollection.insertOne(addedProduct);
         res.send(result);
      })

      //GET A TOKEN BY API  CALL
      app.get('/jwt', async (req, res) => {
         const email = req.query.email;
         const query = {email: email};
         const user = await usersCollection.findOne(query);
         if(user){
            const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '2h'})
            return res.send({accesstoken: token});
         }
         // console.log(user)
         res.status(403).send( {accesstoken: ''})
      })


      //SEND ALL USER TO DB
      app.post('/users', async (req, res) => {
         const user = req.body;
         console.log(user);
         const result = await usersCollection.insertOne(user);
         res.send(result);
      })

      //GET ALL USER FROM DB
      // app.get('/users', verifyJWT,  async (req, res) => {
      //    const email = req.query.email;
      //    const decodedEmail = req.decoded.email;
      //    if(email !== decodedEmail){
      //       return res.status(403).send({message: 'forbiden access'})
      //    }
      //    const query = req.body;
      //    const allUsers = await usersCollection.find(query).toArray();
      //    res.send(allUsers)
      // })

      
      //------------- //GET ALL USER FROM DB //----------------
      //   app.get('/users', async(req,res) =>{
      //     const email = req.query.email;
      //     console.log(email)
      //     const query = {email : email};
      //     const allUser = await usersCollection.find(query).toArray();
      //     res.send(allUser)
      //  })
        app.get('/users', async(req,res) =>{
         //  const email = req.query.email;
         //  console.log(email)
          const query = {};
          const allUser = await usersCollection.find(query).toArray();
          res.send(allUser)
       })

      // app.get('/users/admin/:email',verifyJWT, async (req, res) => {
      //    const email = req.query.email;
      //    console.log(email)
      //    const query = { email };
      //    const allUser = await usersCollection.findOne(query);
      //    res.send({ isAsmin: user?.role === 'admin' })
      // })


      //------// TO DELETE PRODUCT //-------------
     
     
     
      app.delete('/products/:id', async (req, res) => {
         const id = req.params.id;
         // console.log(id)
         const filter = { _id: new ObjectId(id) };
         const result = await productsCollection.deleteOne(filter);
         res.send(result);
      })


      //------// TO DELETE FLOWER //-------------
      app.delete('/flowers/:id', async (req, res) => {
         const id = req.params.id;
         // console.log(id)
         const filter = { _id: new ObjectId(id) };
         const result = await flowersCollection.deleteOne(filter);
         res.send(result);
      })

      //------// TO DELETE FRUIT //-------------
      app.delete('/fruits/:id', async (req, res) => {
         const id = req.params.id;
         // console.log(id)
         const filter = { _id: new ObjectId(id) };
         const result = await fruitsCollection.deleteOne(filter);
         res.send(result);
      })

      //------// TO DELETE BONSAI //-------------
      app.delete('/bonsai/:id', async (req, res) => {
         const id = req.params.id;
         // console.log(id)
         const filter = { _id: new ObjectId(id) };
         const result = await bonsaiCollection.deleteOne(filter);
         res.send(result);
      })

      //------// TO DELETE INDOOR //-------------
      app.delete('/indoors/:id', async (req, res) => {
         const id = req.params.id;
         // console.log(id)
         const filter = { _id: new ObjectId(id) };
         const result = await indoorsCollection.deleteOne(filter);
         res.send(result);
      })

      //------// TO DELETE SPICES //-------------
      app.delete('/spices/:id', async (req, res) => {
         const id = req.params.id;
         // console.log(id)
         const filter = { _id: new ObjectId(id) };
         const result = await spicesCollection.deleteOne(filter);
         res.send(result);
      })
      // //------// TO DELETE SPICES //-------------
      app.delete('/tools/:id', async (req, res) => {
         const id = req.params.id;
         // console.log(id)
         const filter = { _id: new ObjectId(id) };
         const result = await toolsCollection.deleteOne(filter);
         res.send(result);
      })

      //----------// SET ADMIN IN DB------------

      // app.put('/users/admin/:id', verifyJWT, async (req, res) => {
      //    const id = req.params.id;
      //    const filter = { _id: new ObjectId(id) }
      //    const options = { upsert: true };
      //    const updatedDoc = {
      //       $set: {
      //          role: 'admin'

      //       }
      //    }
      //    const result = await usersCollection.updateOne(filter, updatedDoc, options);
      //    res.send(result)
      // })


         app.put('/users/admin/:id',verifyJWT, async (req, res) => {
         const decodedEmail = req.decoded.email;
         const query = {email: decodedEmail};
         const user = await usersCollection.findOne(query);

         if(user.role !== 'admin'){
            return res.status(403).send({message: 'forbiden access'})
         }

         const id = req.params.id;
         const filter = { _id: new ObjectId(id) }
         const options = { upsert: true };
         const updatedDoc = {
            $set: {
               role: 'admin'

            }
         }
         const result = await usersCollection.updateOne(filter, updatedDoc, options);
         res.send(result)
      })




      //------------// CHECK ADMIN IN DB //--------------
      app.get('/users/admin/:email', async (req, res) => {
         const email = req.params.email;
         const query = { email }
         const user = await usersCollection.findOne(query);
         res.send({isAdmin: user?.role === 'admin'});
         
      })
   
   }
   finally {
   }
}

run().catch(console.log);



app.get('/', async (req, res) => {
   res.send('loading from earthly delights')
});


app.listen(port, () => {
   console.log(`Earthly server is listening on ${port}`)
})




// const products = require('./product.json')
// app.get('/product',(req, res) => {
//     res.send(products)
// });