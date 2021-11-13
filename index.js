
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@cluster0.t8ils.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

async function run(){

    try{
        await client.connect()
        const database = client.db('bike_portal')
        const exploreCollection = database.collection('explore')
        const explore2Collection = database.collection('explore2')
        const reviewCollection = database.collection('review')
        const usersCollection = database.collection('users')
        const orderCollection = database.collection('orders')
        // get api
        app.get('/explore', async(req, res)=> {
            const cursor = exploreCollection.find({})
            const explores =  await cursor.toArray()
            res.send(explores)
        })



        // post api 
        app.post('/explore', async(req, res)=> {
            const explore = req.body
            console.log('hit the api ' , explore)
            const result = await exploreCollection.insertOne(explore)
            console.log(result)
            res.json(result)
        })

          // explore2 get api
        app.get('/explore2', async(req, res)=> {
          const cursor = explore2Collection.find({})
          const explore2 = await cursor.toArray()
          res.send(explore2)
        })



        // post api
        app.post('/explore2' , async(req, res) => {
          const explore2 = req.body
          console.log('hit the 2 api', explore2)
          const result = await explore2Collection.insertOne(explore2)
          console.log(result)
          res.json(result)
        })

        // review post
        app.post('/addReview', async (req,res)=> {
          const review = req.body
          const result = await reviewCollection.insertOne(review)
          res.send(result)
        })
        // review get
        app.get('/addReview', async(req, res)=> {
          const cursor = reviewCollection.find({})
          const result =  await cursor.toArray()
          res.send(result)
      })
      
        // user post
        app.post('/users' , async (req, res)=> {
          const user = req.body
          const result = await usersCollection.insertOne(user)
          console.log(result)
          res.send(result)
        })

        app.put('/users/admin' , async (req, res)=> {
          const user = req.body
          console.log('put', user)
          const filter = {email: user.email};
          const updateDoc = {$set: { role:'admin' }};
          const result = await usersCollection.updateOne(filter,updateDoc)
          res.json(result)
        })
        app.get('/users/:email', async(req, res)=> {
          const email= req.params.email
          const query = {email: email}
          const user = await usersCollection.findOne(query)
          let isAdmin = false;
          if(user?.role === 'admin'){
            isAdmin = true;
          }
          res.json({admin : isAdmin})
        })

        //orders get
        app.get('/orders', async ( req , res)=> {
          let query = {}
          const email = req.query.email
          if(email){
            query = {email : email}

          }
          const cursor = orderCollection.find(query)
          const orders = await cursor.toArray()
          res.json(orders)
        })


        // orders api
        app.post('/orders' ,async (req,res)=> {
          const order = req.body
          // order.createdAt = new Data()
          const result = await orderCollection.insertOne(order)
          res.json(result)

        })
        // delete api
        app.delete('/orders/:id' , async(req, res)=> {
          const id = req.params.id
          const query ={_id:ObjectId(id)}
          const result = await orderCollection.deleteOne(query)
          res.json(result)
      })
        





    }
    finally{
        // await client.close()

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello Kawasaki bike family!')
})

app.listen(port, () => {
  console.log(` listening at ${port}`)
})