const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')

require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
// 


app.get('/', (req, res) => {
    res.send('amar sunar modina mar praner')
})



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.oq7uvoj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function run() {

    try {
        const FoodCollection = client.db('foodbar').collection('food')
        const reviewcollection = client.db('user-review').collection('review')


        app.get('/home', async (req, res) => {
            const query = {}
            const cursor = FoodCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })
        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = FoodCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/service', async (req, res) => {
            const query = req.body;
            console.log(query)
            const result = await FoodCollection.insertOne(query)
            res.send(result)
        })
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await FoodCollection.findOne(query)
            res.send(service)
        })
        app.post('/users', async (req, res) => {
            const query = req.body;
            console.log(query)
            const result = await reviewcollection.insertOne(query)
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const query = {}
            console.log(query)
            const cursor = reviewcollection.find(query)
            const review = await cursor.toArray()
            res.send(review)

        })


    }
    finally {



    }

}
run()



app.listen(port, () => {
    console.log(`this server is running on ${port}`)
})