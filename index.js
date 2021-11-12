
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

        // review
        app.post('/addReview', async (req,res)=> {
          const review = req.body
          const result = await reviewCollection.insertOne(review)
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